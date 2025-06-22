"use client";

import { useState, useEffect } from "react";
import { Thermometer, Lock, Lightbulb, Loader2, MapPin, CheckCircle, AlertCircle } from "lucide-react";

type ButtonType = "thermostat" | "lock" | "light";

const getDeviceIcon = (type: ButtonType) => {
  switch (type) {
    case "thermostat":
      return Thermometer;
    case "lock":
      return Lock;
    case "light":
      return Lightbulb;
    default:
      return MapPin;
  }
};

const getDeviceColor = (type: ButtonType) => {
  switch (type) {
    case "thermostat":
      return "text-orange-400";
    case "lock":
      return "text-green-400";
    case "light":
      return "text-yellow-400";
    default:
      return "text-blue-400";
  }
};

const getDeviceGradient = (type: ButtonType) => {
  switch (type) {
    case "thermostat":
      return "from-orange-500 to-red-500";
    case "lock":
      return "from-green-500 to-emerald-500";
    case "light":
      return "from-yellow-500 to-amber-500";
    default:
      return "from-blue-500 to-purple-500";
  }
};

export default function SetupButton({ type }: { type: ButtonType }) {
  const [status, setStatus] = useState<string>("Ready to calibrate");
  const [loading, setLoading] = useState(false);
  const [thermo, setThermo] = useState<number | null>(null);
  const [lock, setLock] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const Icon = getDeviceIcon(type);
  const colorClass = getDeviceColor(type);
  const gradientClass = getDeviceGradient(type);

  // Fetch positions once on mount
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getJSON");
        if (response.status === 200) {
          const data = await response.json();
          setThermo(data.thermo_location);
          setLight(data.light_location);
          setLock(data.lock_location);
        }
      } catch (err) {
        setError("Failed to fetch initial positions");
      }
    };
    fetchPositions();
  }, []);

  const getCurrentPosition = () => {
    switch (type) {
      case "thermostat":
        return thermo;
      case "lock":
        return lock;
      case "light":
        return light;
      default:
        return null;
    }
  };

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setStatus("Listening for device...");
    let lastValue: number | null = null;

    try {
      // Poll API every second for 5 seconds
      for (let i = 0; i < 5; i++) {
        const res = await fetch('http://localhost:3000/api/getInstructions');
        const data = await res.json();
        lastValue = data.location;
        setStatus(`Detecting position: ${lastValue}° (${i + 1}/5)`);
        await new Promise((r) => setTimeout(r, 1000));
      }

      setStatus(`Saving position: ${lastValue}°...`);
      
      const response = await fetch("http://localhost:3000/api/updateJSON", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value: lastValue }),
      });
      
      const results = await response.json();
      
      if (response.status === 200) {
        setStatus(`Position saved: ${lastValue}°`);
        setLight(results.positions.light_location);
        setLock(results.positions.lock_location);
        setThermo(results.positions.thermo_location);
      } else {
        setError(results.message || "Failed to save position");
        setStatus("Setup failed");
      }
    } catch (err) {
      setError("Network error occurred");
      setStatus("Setup failed");
    }
    
    setLoading(false);
  };

  const currentPosition = getCurrentPosition();
  const isConfigured = currentPosition !== null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-80 hover:bg-white/15 transition-all duration-300 hover:scale-105">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full bg-gradient-to-r ${gradientClass}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg capitalize">{type}</h3>
            <p className="text-gray-300 text-sm">Device Setup</p>
          </div>
        </div>
        {isConfigured && (
          <CheckCircle className="w-6 h-6 text-green-400" />
        )}
      </div>

      {/* Current Position */}
      <div className="mb-6">
        <div className="bg-black/20 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Current Position</span>
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {currentPosition !== null ? `${currentPosition}°` : "Not Set"}
          </div>
        </div>
      </div>

      {/* Calibrate Button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 mb-4
          ${loading 
            ? "bg-gray-600 cursor-not-allowed" 
            : `bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:scale-105 active:scale-95`
          }
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calibrating...</span>
          </div>
        ) : (
          `Calibrate ${type.charAt(0).toUpperCase() + type.slice(1)}`
        )}
      </button>

      {/* Status Display */}
      <div className="bg-black/20 rounded-lg p-4 border border-white/10 min-h-[60px] flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <div className="flex items-center justify-center space-x-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : (
            <div className="text-gray-300 text-sm leading-relaxed">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}