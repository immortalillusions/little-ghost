// NOTE: CHANGE UPDATE TO 1 SECOND LATER
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
  
  if (!data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👻</div>
          <div className="text-purple-300 text-lg font-medium animate-bounce">
            Summoning spirits...
          </div>
        </div>
      </div>
    );
  }

  const StatusCard = ({ icon, label, value, isActive }: { 
    icon: string; 
    label: string; 
    value: string; 
    isActive?: boolean 
  }) => (
    <div className={`
      relative p-6 rounded-lg border transition-all duration-300 hover:scale-105
      ${isActive 
        ? 'bg-purple-900/40 border-purple-400/60 shadow-lg shadow-purple-500/20' 
        : 'bg-gray-900/60 border-gray-600/40 hover:border-purple-500/40'
      }
    `}>
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-purple-200 text-sm font-medium opacity-80">
            {label}
          </div>
          <div className={`text-lg font-bold ${
            isActive ? 'text-purple-300' : 'text-gray-300'
          }`}>
            {value}
          </div>
        </div>
      </div>
      {/* Ghostly glow effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-purple-500/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-purple-900/30 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="animate-bounce">👻</span>
            Home Status
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>👻</span>
          </h1>
          <div className="text-purple-300 text-lg opacity-80">
            Monitoring the home...
          </div>
        </div>

        {/* Ghost Vision Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-900/40 border border-blue-500/50 rounded-lg shadow-lg shadow-blue-500/10">
            <div className="flex items-center space-x-3">
              <span className="text-2xl animate-pulse">👁️</span>
              <div>
                <div className="text-blue-200 font-medium">Ghost Vision:</div>
                <div className="text-blue-100 text-lg">
                  Lil Ghost is looking at {data.location}°
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-900/40 border border-green-500/50 rounded-lg shadow-lg shadow-green-500/10">
            <div className="flex items-center space-x-3">
              <span className="text-2xl animate-pulse">🔍</span>
              <div>
                <div className="text-green-200 font-medium">Spirit Focus:</div>
                <div className="text-green-100 text-lg">
                  Lil Ghost is looking at {data.item === "nothing" ? "nothing" : `the ${data.item}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Positions */}
        <div className="mb-6 p-4 bg-purple-900/40 border border-purple-500/50 rounded-lg shadow-lg shadow-purple-500/10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl animate-pulse">📍</span>
            <div className="text-purple-200 font-medium text-lg">Device Positions:</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-100">
            <div className="flex items-center gap-2">
              <span>🌡️</span>
              <span>Thermostat: {thermo}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔐</span>
              <span>Lock: {lock}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕯️</span>
              <span>Light: {light}°</span>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {data.message && (
          <div className="mb-6 p-4 bg-orange-900/40 border border-orange-500/50 rounded-lg shadow-lg shadow-orange-500/10">
            <div className="flex items-center space-x-3">
              <span className="text-2xl animate-pulse">🎃</span>
              <div>
                <div className="text-orange-200 font-medium">Spectral Message:</div>
                <div className="text-orange-100 text-lg">{data.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            icon="🌡️"
            label="Thermostat Temperature"
            value={data.thermostat ? `${data.temp}°F` : "Off"}
            isActive={data.thermostat}
          />
          
          <StatusCard
            icon="🔥"
            label="Thermostat"
            value={data.thermostat ? "On" : "Off"}
            isActive={data.thermostat}
          />
          
          <StatusCard
            icon="🕯️"
            label="Light"
            value={data.light ? "On" : "Off"}
            isActive={data.light}
          />
          
          <StatusCard
            icon="🔐"
            label="Lock"
            value={data.lock ? "Locked" : "Unlocked"}
            isActive={data.lock}
          />
        </div>

        {/* Floating spirits animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 text-2xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>
            👻
          </div>
          <div className="absolute top-40 right-20 text-xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            🦇
          </div>
          <div className="absolute bottom-32 left-1/4 text-lg opacity-25 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
            ☠️
          </div>
        </div>
      </div>
    </div>
  );
}