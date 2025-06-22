// NOTE: CHANGE UPDATE TO 1 SECOND LATERMore actions
"use client";
import { useEffect, useState } from "react";
import {fetchData} from './data';
import { Data } from './types';
export default function LiveStatus() {
const [data, setData] = useState<Data | null>(null);
const [thermo, setThermo] = useState<number | null>(null);
const [lock, setLock] = useState<number | null>(null);
const [light, setLight] = useState<number | null>(null);
  // Fetch positions once on mount
  useEffect(() => {
    const fetchPositions = async () => {
      const response = await fetch("http://localhost:3000/api/getJSON");
      if (response.status === 200) {
        const data = await response.json();
        setThermo(data.thermo_location);
        setLight(data.light_location);
        setLock(data.lock_location);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      }
    };

    fetchAndSetData(); // fetch immediately on mount
    // change to 1s later
    const interval = setInterval(fetchAndSetData, 50);

    return () => clearInterval(interval);
  }, []);
  console.log("Data fetched:", data);
  if (!data) return <div>Loading...</div>;

  return (
    <div>
        <div>Lil Ghost is looking at {data.location} degrees.</div>
        <div>Lil Ghost is looking at {data.item == "nothing" ? "nothing" : "the "+data.item}.</div>
        <div>Thermostat location: {thermo}</div>
        <div>Lock location: {lock}</div>
        <div>Light location: {light}</div>
        <div> {data.message != "" ? "Message: " + data.message: ""}</div>
        <div>
            <div>Temp: {data.thermostat ? data.temp : "Thermostat is off"}</div>
            <div>Thermostat: {data.thermostat ? "On" : "Off"}</div>
            <div>Light: {data.light ? "On" : "Off"}</div>
            <div>Lock: {data.lock ? "Locked" : "Unlocked"}</div>
        </div>
    </div>
  );
}