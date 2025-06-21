// {"gesture":"right_roll", "location":"91"}
// location: number from 0 to 360
// gesture: forward_roll, backward_roll, right_roll, left_roll

"use server";
import { Data } from './types';
import fs from "fs/promises";
import path from "path";

let temp = 20; // temp
let thermostat = false; // off
let light = false; // off
let lock = false; // unlocked
let message = "";
let item = "NONE"; // default item
const tolerance = 5;

export async function fetchData() {
  // simulate getting data from the accelerator / gyrometer
  const res = await fetch('http://localhost:3000/api/getInstructions'); // Example API
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  const gesture = data.gesture;
  const location = data.location;
  // Read locations from a JSON file
  const locationsPath = path.join(process.cwd(), "locations.json");
  const locationsRaw = await fs.readFile(locationsPath, "utf-8");
  const { thermo_location, lock_location, light_location } = JSON.parse(locationsRaw);

  if (thermo_location - tolerance <= location && location <= thermo_location + tolerance) {
    item = "thermostat"; // thermostat
  } else if (lock_location - tolerance <= location && location <= lock_location + tolerance) {
    item = "lock"; // lock
  } else if (light_location - tolerance <= location && location <= light_location + tolerance) {
    item = "light"; // light  
  } else {
    item = "NONE"; // no item
  }
  console.log(`Location: ${location}, Item: ${item}`);

  console.log(`Gesture: ${gesture}, Item: ${item}`);
  // change temp
  if (item == "thermostat" && thermostat) {
    if(gesture == 'forward_roll') {
      temp += 1; // increase temp
      message = "Temperature increased to " + temp + "°C";
    } else if (gesture == 'backward_roll') {
      temp -= 1;
      message = "Temperature decreased to " + temp + "°C";

    } 
  }
  // open thermostat
  if (item == "thermostat") {
    if (gesture == 'right_roll') {
      thermostat = true; // turn on
      message = "Thermostat turned on";
    } else if (gesture == 'left_roll') {
      thermostat = false; // turn off
      message = "Thermostat turned off";
    }
  }
  // toggle light
  if (item == "light") {
    if (gesture == 'right_roll') {
      light = true; // turn on
      message = "Light turned on";
    } else if (gesture == 'left_roll') {
      light = false; // turn off
      message = "Light turned off";
    }
  }
  // toggle lock
  if (item == "lock") {
    if (gesture == 'right_roll') {
      lock = true; // lock
      message = "Door locked";
    } else if (gesture == 'left_roll') {
      lock = false; // unlock
      message = "Door unlocked";
    }
  }
  return {temp, thermostat, light, lock, message} as Data;
}
