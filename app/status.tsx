// NOTE: CHANGE UPDATE TO 1 SECOND LATERMore actions
"use client";
import { useEffect, useState } from "react";
import {fetchData} from './data';
import { Data } from './types';
export default function LiveStatus() {
  const [data, setData] = useState<Data | null>(null);

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
    const interval = setInterval(fetchAndSetData, 10000);

    return () => clearInterval(interval);
  }, []);
  console.log("Data fetched:", data);
  if (!data) return <div>Loading...</div>;

  return (
    <div>
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