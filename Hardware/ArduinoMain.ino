#include <LiquidCrystal.h>

// LCD pins
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

const int lightPin = 8; // Light control pin

byte smiley[8] = {
  0b00000, 0b00000, 0b01010, 0b00000,
  0b00000, 0b10001, 0b01110, 0b00000
};

String serialBuffer = "";
bool dataReady = false;
String latestCSV = "";

void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);

  pinMode(lightPin, OUTPUT);  // Set light pin as output
  digitalWrite(lightPin, LOW); // Start with light off

  lcd.createChar(1, smiley);

  lcd.setCursor(0, 0);
  lcd.print("I ");
  lcd.print(" Arduino! ");
  lcd.write(byte(0));
  delay(500);
  Serial.println("READY");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      handleSerialCommand(serialBuffer);
      serialBuffer = "";
    } else if (c != '\r') {
      serialBuffer += c;
    }
  }

  if (dataReady) {
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.setCursor(0, 1);
    lcd.print(latestCSV.substring(0, 16)); // truncate if needed
    dataReady = false;
  }

  // Animate character
  int sensor = analogRead(A0);
  int delayTime = map(sensor, 0, 1023, 200, 1000);
  lcd.setCursor(15, 1);
  lcd.write(byte(3));
  delay(delayTime);
  lcd.setCursor(15, 1);
  lcd.write(byte(4));
  delay(delayTime);
}

void handleSerialCommand(String cmd) {
  cmd.trim();
  if (cmd == "HELLO") {
    Serial.println("ACK");
  } else if (cmd == "on") {
    digitalWrite(lightPin, HIGH);
    Serial.println("LIGHT ON");
  } else if (cmd == "off") {
    digitalWrite(lightPin, LOW);
    Serial.println("LIGHT OFF");
  } else if (cmd.indexOf(',') != -1) {
    latestCSV = cmd;
    dataReady = true;
    Serial.println("OK");
  } else {
    Serial.println("ERR");
  }
}
