"use server";
import { Data } from './types';

let temp = 20; // temp
let thermostat = false; // off
let light = false; // off
let lock = false; // unlocked
let message = "";

export async function fetchData() {
  // simulate getting data from the accelerator / gyrometer
  const res = await fetch('http://localhost:3000/api/getInstructions'); // Example API
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  const gesture = data.gesture;
  const item = data.item;
  console.log(`Gesture: ${gesture}, Item: ${item}`);
  // change temp
  if (item == "temp" && thermostat) {
    if(gesture == 'right_roll') {
      temp += 1; // increase temp
      message = "Temperature increased to " + temp + "°C";
    } else if (gesture == 'left_roll') {
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
