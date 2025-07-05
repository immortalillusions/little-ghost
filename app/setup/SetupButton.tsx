"use client";

import { useState, useEffect } from "react";

type ButtonType = "thermostat" | "lock" | "light";

const deviceConfig = {
  thermostat: {
    icon: "🌡️",
    name: "Thermostat",
    color: "orange",
    description: "Controls the spirit realm temperature"
  },
  lock: {
    icon: "🔐",
    name: "Lock",
    color: "red",
    description: "Seals portals to other dimensions"
  },
  light: {
    icon: "🕯️",  
    name: "Light",
    color: "yellow",
    description: "Illuminates the supernatural realm"
  }
};

export default function SetupButton({ type, activeType, setActiveType }: { type: ButtonType; activeType: ButtonType | null; setActiveType: (type: ButtonType | null) => void }) {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [thermo, setThermo] = useState<number | null>(null);
  const [lock, setLock] = useState<number | null>(null);
  const [light, setLight] = useState<number | null>(null);

  const config = deviceConfig[type];

  const baseUrl = process.env.NODE_ENV === "production"? process.env.PUBLIC_BASE_URL: "http://localhost:3000"; // Use environment variable or fallback to localhost

  // Fetch positions once on mount
  useEffect(() => {
    const fetchPositions = async () => {
      const response = await fetch(`${baseUrl}/api/getJSON`);
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
    setActiveType(type);
    setLoading(true);
    setStatus("🔮 Communing with spirits...");
    let lastValue: number | null = null;

    // Poll API every second for 5 seconds
    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${baseUrl}/api/getInstructions`);
      const data = await res.json();
      lastValue = data.location;
      setStatus(`👻 Spirit whispers: ${lastValue}° (${i + 1}/5)`);
      await new Promise((r) => setTimeout(r, 1000));
    }
    
    setStatus(`⚡ Binding essence at ${lastValue}°...`);
    
    const response = await fetch(`${baseUrl}/api/updateJSON`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value: lastValue }),
    });
    
    const results = await response.json();
    
    if (response.status == 200) {
      setStatus(`✨ Set up complete! Bound at ${lastValue}°`);
    } else {
      setStatus(`💀 Set up failed: ${results.message}`);
    }
    
    setLight(results.positions.light_location);
    setLock(results.positions.lock_location);
    setThermo(results.positions.thermo_location);
    
    setLoading(false);
    setActiveType(null);
  };

  const getCurrentPosition = () => {
    switch(type) {
      case "thermostat": return thermo;
      case "lock": return lock;
      case "light": return light;
      default: return null;
    }
  };

  const getColorClasses = () => {
    switch(config.color) {
      case "orange": return {
        border: "border-orange-500/50",
        bg: "bg-orange-900/30",
        button: "bg-orange-600 hover:bg-orange-700",
        shadow: "shadow-orange-500/20"
      };
      case "red": return {
        border: "border-red-500/50", 
        bg: "bg-red-900/30",
        button: "bg-red-600 hover:bg-red-700",
        shadow: "shadow-red-500/20"
      };
      case "yellow": return {
        border: "border-yellow-500/50",
        bg: "bg-yellow-900/30", 
        button: "bg-yellow-600 hover:bg-yellow-700",
        shadow: "shadow-yellow-500/20"
      };
      default: return {
        border: "border-purple-500/50",
        bg: "bg-purple-900/30",
        button: "bg-purple-600 hover:bg-purple-700", 
        shadow: "shadow-purple-500/20"
      };
    }
  };

  const colors = getColorClasses();
  const currentPos = getCurrentPosition();

  return (
    <div className={`
      relative w-80 p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105
      ${colors.border} ${colors.bg} shadow-lg ${colors.shadow}
      backdrop-blur-sm
    `}>
      {/* Floating icon */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="text-4xl animate-bounce bg-black/80 rounded-full p-2 border border-current">
          {config.icon}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6 mt-4">
        <h3 className="text-xl font-bold text-white mb-1">{config.name}</h3>
        <p className="text-gray-300 text-sm opacity-80">{config.description}</p>
      </div>

      {/* Position Display */}
      <div className="mb-6 p-4 bg-black/40 rounded-lg border border-gray-600/30">
        <div className="text-center">
          <div className="text-gray-400 text-sm font-medium mb-1">Current Position</div>
          <div className="text-2xl font-bold text-white">
            {currentPos !== null ? `${currentPos}°` : "Loading..."}
          </div>
          <div className="text-gray-500 text-xs mt-1">Degrees Celsius</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleClick}
        disabled={loading || (activeType !== null)}
        className={`
          w-full h-12 text-white font-medium rounded-lg transition-all duration-300
          ${colors.button}
          ${loading || (activeType !== null)
            ? 'opacity-60' 
            : 'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }
          flex items-center justify-center gap-2
        `}
      >
        {loading ? (
          <>
            <span className="animate-spin text-lg">🔮</span>
            Setting up...
          </>
        ) : (
          <>
            <span>{config.icon}</span>
            Set up {config.name}
          </>
        )}
      </button>

      {/* Status Display */}
      <div className="mt-4 p-4 bg-black/60 rounded-lg border border-gray-700/40 min-h-16">
        <div className="text-center text-sm text-gray-300 break-words">
          {status || (
            <span className="text-gray-500 italic">
              Awaiting instructions...
            </span>
          )}
        </div>
      </div>

      {/* Mystical border glow effect */}
      {loading && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-current to-transparent opacity-20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}