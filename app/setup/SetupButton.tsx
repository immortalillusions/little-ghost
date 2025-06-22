"use client";

import { useState, useEffect } from "react";

type ButtonType = "thermostat" | "lock" | "light";

export default function SetupButton({ type }: { type: ButtonType }) {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
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
  const handleClick = async () => {
    setLoading(true);
    setStatus("Listening for 5 seconds...");
    let lastValue: number | null = null;

    // Poll API every second for 5 seconds
    for (let i = 0; i < 5; i++) {
      const res = await fetch('http://localhost:3000/api/getInstructions');
      const data = await res.json();
      lastValue = data.location;
      setStatus(`Received position: ${lastValue} (second ${i + 1}/5)`);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setStatus(`Saving position: ${lastValue}...`);
    const response = await fetch("http://localhost:3000/api/updateJSON", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value: lastValue }),
    });
    const results = await response.json();
    if (response.status == 200) {
      setStatus(`Location saved as ${lastValue}!`);
    } else {
      setStatus(`Error: ${results.message}`);
    }
    

    setLight(results.positions.light_location);
    setLock(results.positions.lock_location);
    setThermo(results.positions.thermo_location);
    
    setLoading(false);
  };

  return (
    <div
      style={{
        margin: "0 1rem",
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        width: "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div>Positions in Degrees: {String(type) == "thermostat"? thermo : String(type) == "lock" ? lock : light}</div>

    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        width: "200px",
        height: "40px",
        fontSize: "1rem",
        borderRadius: "6px",
        marginBottom: "0.5rem",
        whiteSpace: "normal",
        wordBreak: "break-word",
        backgroundColor: loading ? "#b0b0b0" : "#1976d2",
        color: "#fff",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.2s",
      }}
      onMouseOver={e => {
        if (!loading) (e.currentTarget.style.backgroundColor = "#1565c0");
      }}
      onMouseOut={e => {
        if (!loading) (e.currentTarget.style.backgroundColor = "#1976d2");
      }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
      <div
        style={{
          width: "200px",
          height: "48px",
          border: "2px solid #ccc",
          borderRadius: "6px",
          padding: "0.5rem",
          fontSize: "0.95rem",
          textAlign: "center",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status}
      </div>
    </div>
);
}