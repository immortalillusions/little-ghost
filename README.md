# Lil Ghost Smart Home System

Lil Ghost is a full-stack smart home system that allows users to control home appliances using natural human gestures from a distance. This project is especially useful for people with disabilities or anyone who wants a more convenient, hands-free way to interact with their environment.

## How it Works
Lil Ghost has three main components:
1) IMU Sensor & ESP32: Generates input data and sends gesture (roll_right, roll_left, pitch_up, pitch_down) and position (0-360 degrees) data via WIFI
2) Website: UI displays the status of all devices (e.g., temperature of thermostat, whether the lock is locked) and has a setup option to allow the user to choose the location of each device.
3) Devices Prototype: Prototype of the lights (using LED) and thermostat (using LCD) on an Arduino. This is connected to a Python server via serial connection (since we did not have an Arduino with a wifi module). The Python server receives data from the IMU.
![image](https://github.com/user-attachments/assets/9195a7d9-eb71-479f-ac13-8affdd99d89a)

## Features

- **Gesture-Based Control:**  
  Use natural gestures (detected by an IMU containing an accelerometer and gyroscope) to control appliances such as lights, thermostat, and door locks.

- **Remote & Accessible:**  
  Designed to be helpful for users with limited mobility, or anyone who wants to control their home without getting up.

- **Real-Time Feedback:**  
  The website displays the current status of all appliances and updates in real time as gestures are performed.

- **Full Stack Integration:**  
  - **Frontend & Backend:** Modern React/Next.js web interface with 4 custom API calls to communicate with the embedded systems and frontend/backend.
  - **Embedded:** ESP32 microcontroller receives IMU data and sends gesture info to the server via TCP.
  - **Appliance Simulation:** Arduino receives commands from the server via USB serial and simulates real appliances:
    - **Thermostat:** LCD display shows temperature, can be turned on/off and number adjusted.
    - **Light:** LED simulates a light turning on/off.
    - **Lock:** Servo motor simulates locking/unlocking a door.

## How It Works

1. **Gesture Detection:**  
   The IMU (on the ESP32) captures human movement and recognizes gestures.

2. **Data Transmission:**  
   The ESP32 sends gesture data to the web server over TCP.

3. **Web Server:**  
   The server processes the gesture and updates the appliance state.

4. **Website:**  
   The main website displays the current state and allows for additional manual control.

5. **Appliance Control:**  
   The server relays commands to an Arduino via USB serial. The Arduino simulates the appliances using an LCD, LED, and servo.

## Technologies Used

- **Website:** React, Next.js, TypeScript, CSS
- **Embedded:** ESP32 (C++/Arduino), Arduino Uno
- **Communication:** TCP (ESP32 to server), USB Serial (server to Arduino)
- **Sensors:** IMU (accelerometer + gyroscope)

## Use Cases

- **Accessibility:**  
  Enables users with disabilities to control their home environment easily.

- **Convenience:**  
  Great for anyone who wants to control appliances without moving from their spot.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**  
   ```sh
   npm install
3. **Setup the IMU and the Arduino (LED, LCD, servo motor).** If there are no devices / hardware, the website will display live mock data.
