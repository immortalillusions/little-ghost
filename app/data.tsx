// {"gesture":"roll_right", "location":"91"}
// location: number from 0 to 360
// gesture: pitch_up, pitch_down, roll_right, roll_left

"use server";
import { Data } from './types';
import fs from "fs/promises";
import path from "path";

let temp = 20; // temp (and change updateJSON to be 45)
let thermostat = false; // off
let light = false; // off
let lock = false; // unlocked
let message = "";
let item = "nothing"; // default item
const tolerance = 20;

// account for circularity
function inRange(center: number, value: number, tolerance: number) {
  const diff = Math.abs(((value - center + 180 + 360) % 360) - 180);
  return diff <= tolerance;
}

export async function fetchData() {
  // simulate getting data from the accelerator / gyrometer
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";
  console.log(`Base URL: ${baseUrl}`);
  console.log("ENV VARS:", JSON.stringify(process.env, null, 2));
  const res = await fetch(`${baseUrl}/api/getInstructions`); // Example API
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  const gesture = data.gesture;
  const location = data.location;
  const mock = data.mock;
  // Read locations from a JSON file
  const locationsPath = path.join(process.cwd(), "locations.json");
  const locationsRaw = await fs.readFile(locationsPath, "utf-8");
  const { thermo_location, lock_location, light_location } = JSON.parse(locationsRaw);

  if (inRange(thermo_location, location, tolerance)) {
    item = "thermostat";
  } else if (inRange(lock_location, location, tolerance)) {
    item = "lock";
  } else if (inRange(light_location, location, tolerance)) {
    item = "light";
  } else {
    item = "nothing";
  }
  console.log(`Location: ${location}, Item: ${item}`);

  console.log(`Gesture: ${gesture}, Item: ${item}`);
  // change temp
  if (item == "thermostat" && thermostat) {
    if (gesture == 'pitch_up') {
      temp += 1; // increase temp
      message = "Lil Ghost increased temperature to " + temp + "°C";
    } else if (gesture == 'pitch_down') {
      temp -= 1;
      message = "Lil Ghost decreased temperature to " + temp + "°C";

    }
  }
  // open thermostat
  if (item == "thermostat") {
    if (gesture == 'roll_right') {
      thermostat = true; // turn on
      message = "Lil Ghost turned on the thermostat";
    } else if (gesture == 'roll_left') {
      thermostat = false; // turn off
      message = "Lil Ghost turned off the thermostat";
    }
  }
  // toggle light
  if (item == "light") {
    if (gesture == 'roll_right') {
      light = true; // turn on
      message = "Lil Ghost turned on the light";
    } else if (gesture == 'roll_left') {
      light = false; // turn off
      message = "Lil Ghost turned off the light";
    }
  }
  // toggle lock
  if (item == "lock") {
    if (gesture == 'roll_right') {
      lock = true; // lock
      message = "Lil Ghost locked the door";
    } else if (gesture == 'roll_left') {
      lock = false; // unlock
      message = "Lil Ghost unlocked the door";
    }
  }
  return { temp, thermostat, light, lock, message, location, item, mock } as Data;
}
