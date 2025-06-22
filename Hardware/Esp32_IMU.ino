#include <Wire.h>
#include "MPU6050.h"
#include <WiFi.h>
#include <WebServer.h>
#include <MadgwickAHRS.h>
#include <math.h>

const char* ssid = "ghost";
const char* password = "awsd1234";

MPU6050 mpu;
Madgwick filter;

WebServer server(80);

int16_t axRaw, ayRaw, azRaw, gxRaw, gyRaw, gzRaw;

float axOffset = 0, ayOffset = 0, azOffset = 0;
float gxOffset = 0, gyOffset = 0, gzOffset = 0;

String lastGesture = "none";
String finalGesture = "none";  
unsigned long lastGestureMs = 0;
const uint16_t gestureCooldown = 300;  // ms
const uint16_t doubleGestureWindow = 1000;
const float aThresh = 1.5f;            // g
const float gThresh = 160.0f;          // °/s
const float tapThresh = 1.4f;          // g spike
const float alpha = 0.25f;

String firstGesture = "none";
unsigned long firstGestureMs = 0;
int gestureCount = 0;
unsigned long finalGestureMs = 0;
const uint16_t finalGestureDisplayTime = 1000;  
bool calibrated = false;
unsigned long calibStart = 0;
int calibSamples = 0;
float axSum = 0, aySum = 0, azSum = 0, gxSum = 0, gySum = 0, gzSum = 0;

void detectGesture(float ax, float ay, float az, float gx, float gy, float gz);
void processDoubleGesture(String currentGesture);

float yawRefDeg = 0.0f;
bool yawRefSet = false;
float headingDeg = 0.0f;
String compassDir = "N";

String headingToDir(float deg) {
  static const char* dirs[8] = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" };
  int idx = int((deg + 22.5f) / 45.0f) & 7;
  return String(dirs[idx]);
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();

  if (!mpu.testConnection()) {
    Serial.println("MPU6050 connection failed");
    while (1)
      ;
  }

  filter.begin(512.0f);
  calibStart = millis();

  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  server.on("/", []() {
    server.send(200, "text/plain", finalGesture); 
  });

  server.on("/yaw", []() {
    server.send(200, "text/plain", String(filter.getYaw()));
  });

  server.on("/direction", []() {
    server.send(200, "text/plain", compassDir);
  });

  server.on("/heading", []() {  // absolute heading in degrees
    server.send(200, "text/plain", String(headingDeg, 1));
  });

  server.begin();
  Serial.println("Web server started");
}

void loop() {
  server.handleClient();

  // Reset finalGesture to "none" after display time
  if (finalGesture != "none" && millis() - finalGestureMs > finalGestureDisplayTime) {
    finalGesture = "none";
    Serial.println("Final gesture reset to none");
  }

  mpu.getMotion6(&axRaw, &ayRaw, &azRaw, &gxRaw, &gyRaw, &gzRaw);

  float ax = axRaw / 16384.0f;  // ±2g range
  float ay = ayRaw / 16384.0f;
  float az = azRaw / 16384.0f;
  float gx = gxRaw / 131.0f;  // ±250°/s range
  float gy = gyRaw / 131.0f;
  float gz = gzRaw / 131.0f;

  if (!calibrated) {
    if (millis() - calibStart < 5000) {
      axSum += ax;
      aySum += ay;
      azSum += az;
      gxSum += gx;
      gySum += gy;
      gzSum += gz;
      calibSamples++;

      if (calibSamples % 100 == 0) {
        Serial.print("Calibrating... ");
        Serial.print((millis() - calibStart) / 1000.0);
        Serial.println("s");
      }
      return;
    } else {
      axOffset = axSum / calibSamples;
      ayOffset = aySum / calibSamples;
      azOffset = azSum / calibSamples - 1.0f;
      gxOffset = gxSum / calibSamples;
      gyOffset = gySum / calibSamples;
      gzOffset = gzSum / calibSamples;
      calibrated = true;

      Serial.println("Calibration complete!");
      Serial.printf("Accel offsets: %.3f, %.3f, %.3f\n", axOffset, ayOffset, azOffset);
      Serial.printf("Gyro offsets: %.3f, %.3f, %.3f\n", gxOffset, gyOffset, gzOffset);
    }
  }

  ax -= axOffset;
  ay -= ayOffset;
  az -= azOffset;
  gx -= gxOffset;
  gy -= gyOffset;
  gz -= gzOffset;

  filter.updateIMU(gx, gy, gz, ax, ay, az);

  float roll = filter.getRoll();
  float pitch = filter.getPitch();
  float yaw = fmodf(filter.getYaw(), 360.0f);

  if (calibrated && !yawRefSet) {
    yawRefDeg = yaw;
    yawRefSet = true;
  }

  if (yawRefSet) {
    headingDeg = fmodf(yaw - yawRefDeg + 360.0f, 360.0f); 
    compassDir = headingToDir(headingDeg);
  }

  detectGesture(ax, ay, az, gx, gy, gz);

  delay(10);
}

void detectGesture(float ax, float ay, float az, float gx, float gy, float gz) {
  if (millis() - lastGestureMs < gestureCooldown) return;

  String newGesture = "none";

  if (fabs(ax) > aThresh) {
    newGesture = (ax > 0) ? "shake_x_pos" : "shake_x_neg";
  } else if (fabs(ay) > aThresh) {
    newGesture = (ay > 0) ? "shake_y_pos" : "shake_y_neg";
  } else if (fabs(az) > aThresh) {
    newGesture = (az > 0) ? "shake_z_pos" : "shake_z_neg";
  }
  else if (fabs(gx) > gThresh) {
    newGesture = (gx > 0) ? "roll_right" : "roll_left";
  } else if (fabs(gy) > gThresh) {
    newGesture = (gy > 0) ? "pitch_up" : "pitch_down";
  }

  if (newGesture != "none") {
    lastGestureMs = millis();
    processDoubleGesture(newGesture);
  }
}

void processDoubleGesture(String currentGesture) {
  unsigned long currentTime = millis();
  
  // Check if we're within the double gesture time window
  if (currentTime - firstGestureMs > doubleGestureWindow) {
    // Reset if too much time has passed
    firstGesture = "none";
    gestureCount = 0;
  }
  
  if (firstGesture == "none") {
    // First gesture detected
    firstGesture = currentGesture;
    firstGestureMs = currentTime;
    gestureCount = 1;
    
    Serial.print("First gesture detected: ");
    Serial.println(firstGesture);
  } else {
    if (currentGesture == firstGesture) {
      gestureCount++;
      
      if (gestureCount >= 2) {
        // Double gesture confirmed!
        finalGesture = firstGesture;
        finalGestureMs = millis();  
        Serial.print("DOUBLE GESTURE CONFIRMED: ");
        Serial.println(finalGesture);
        
        firstGesture = "none";
        gestureCount = 0;
      }
    } else {
      firstGesture = currentGesture;
      firstGestureMs = currentTime;
      gestureCount = 1;
      
      Serial.print("New gesture sequence started: ");
      Serial.println(firstGesture);
    }
  }
}