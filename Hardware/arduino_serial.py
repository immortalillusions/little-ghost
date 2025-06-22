import time, hashlib
import requests
import serial

PORT        = "COM7"
BAUD        = 9600
POLL_MS     = 200
TIMEOUT_S   = 2
HELLO_CMD   = "HELLO"
API_ACTION  = "http://192.168.4.1/"
API_HEADING = "http://192.168.4.1/heading"

temp       = 20.0
thermostat = False
light      = False
lock       = False
message    = ""


def sha1(s: str) -> str:
    return hashlib.sha1(s.encode()).hexdigest()


def wait_for_line(ser, expected, timeout):
    deadline = time.time() + timeout
    while time.time() < deadline:
        if ser.in_waiting:
            line = ser.readline().decode("utf-8", "ignore").strip()
            print("[ARDUINO]", line)
            if line == expected:
                return True
        time.sleep(0.2)
    return False


def open_port():
    ser = serial.Serial(PORT, BAUD, timeout=0.1)
    print(f"[INFO] Opened {PORT} @ {BAUD}")
    if not wait_for_line(ser, "READY", 5):
        print("[WARN] No READY banner detected.")
    return ser


def write_line(ser, line):
    ser.write((line + "\n").encode())
    ser.flush()
    print("[TX]", line)


def handshake(ser):
    write_line(ser, HELLO_CMD)
    if not wait_for_line(ser, "ACK", TIMEOUT_S):
        raise RuntimeError("Handshake failed (no ACK)")


def poll_and_update():
    global temp, thermostat, light, lock, message
    
    try:
        gesture = requests.get(API_ACTION, timeout=1).text.strip()
        heading_raw = requests.get(API_HEADING, timeout=1).text.strip()
        print(gesture)
        print(heading_raw)
        try:
            heading = float(heading_raw)
        except:
            heading = None

        item = None
        if heading is not None:
            if 315 <= heading or heading < 45:
                item = "temp"
            elif 45 <= heading < 135:
                item = "thermostat"
            elif 135 <= heading < 225:
                item = "light"
            elif 225 <= heading < 315:
                item = "lock"

        if item == "temp" and thermostat:
            if gesture == "roll_right":
                temp += 1
                message = f"Temperature increased to {temp:.0f}°C"
            elif gesture == "roll_left":
                temp -= 1
                message = f"Temperature decreased to {temp:.0f}°C"
        elif item == "thermostat":
            if gesture == "roll_right":
                thermostat = True
                message = "Thermostat turned on"
            elif gesture == "roll_left":
                thermostat = False
                message = "Thermostat turned off"
        elif item == "light":
            if gesture == "roll_right":
                light = True
                message = "Light turned on"
            elif gesture == "roll_left":
                light = False
                message = "Light turned off"
        elif item == "lock":
            if gesture == "roll_right":
                lock = True
                message = "Door locked"
            elif gesture == "roll_left":
                lock = False
                message = "Door unlocked"

        csv = f"{int(light)},{int(lock)},{temp:.1f},{message.replace(',', ' ')},{int(thermostat)}"
        return csv
    except Exception as e:
        print("[WARN] Poll error:", e)
        return None


def main():
    ser = None
    last_hash = ""
    
    try:
        ser = open_port()
        handshake(ser)
        print("[INFO] Handshake successful.")

        while True:
            csv = poll_and_update()
            if csv:        
                write_line(ser, csv)
                if not wait_for_line(ser, "OK", TIMEOUT_S):
                    print("[ERROR] No OK from Arduino.")
            
            time.sleep(POLL_MS / 1000.0)
            
    except KeyboardInterrupt:
        print("\nInterrupted.")
    finally:
        if ser and ser.is_open:
            ser.close()
            print("[INFO] Serial port closed.")


if __name__ == "__main__":
    main()