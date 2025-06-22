"use client";
import { useEffect, useState } from "react";
import { Thermometer, Lightbulb, Lock, Unlock, Power, PowerOff, MessageCircle } from "lucide-react";

// Mock data function for demo
const fetchData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    message: Math.random() > 0.7 ? "System running normally" : "",
    thermostat: Math.random() > 0.3,
    temp: Math.floor(Math.random() * 10) + 68,
    light: Math.random() > 0.5,
    lock: Math.random() > 0.4
  };
};

export default function LiveStatus() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
        setIsLoading(false);
      }
    };

    fetchAndSetData(); // fetch immediately on mount
    // change to 1s later
    const interval = setInterval(fetchAndSetData, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log("Data fetched:", data);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            <span className="text-white text-lg font-medium">Loading system status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-red-500/50">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <h2 className="text-white text-xl font-semibold mb-2">Connection Error</h2>
            <p className="text-gray-300">Unable to fetch system data</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status ? "text-green-400" : "text-gray-400";
  };

  const getStatusBg = (status) => {
    return status ? "bg-green-500/20 border-green-500/30" : "bg-gray-500/20 border-gray-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Home Dashboard</h1>
          <p className="text-blue-200">Real-time system monitoring</p>
          <div className="text-sm text-gray-400 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Message Alert */}
        {data.message && (
          <div className="mb-6">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <MessageCircle className="text-blue-400 w-5 h-5" />
                <span className="text-blue-100 font-medium">Message: {data.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature */}
          <div className={`${getStatusBg(data.thermostat)} rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <Thermometer className={`w-8 h-8 ${getStatusColor(data.thermostat)}`} />
              <div className={`p-2 rounded-full ${data.thermostat ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
                {data.thermostat ? (
                  <Power className="w-4 h-4 text-green-400" />
                ) : (
                  <PowerOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Temperature</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {data.thermostat ? `${data.temp}°F` : "OFF"}
            </div>
            <p className={`text-sm ${data.thermostat ? 'text-green-300' : 'text-gray-400'}`}>
              Thermostat {data.thermostat ? 'Active' : 'Inactive'}
            </p>
          </div>

          {/* Light */}
          <div className={`${getStatusBg(data.light)} rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className={`w-8 h-8 ${getStatusColor(data.light)}`} />
              <div className={`p-2 rounded-full ${data.light ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
                {data.light ? (
                  <Power className="w-4 h-4 text-green-400" />
                ) : (
                  <PowerOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Lighting</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {data.light ? "ON" : "OFF"}
            </div>
            <p className={`text-sm ${data.light ? 'text-green-300' : 'text-gray-400'}`}>
              Status: {data.light ? 'Active' : 'Inactive'}
            </p>
          </div>

          {/* Lock */}
          <div className={`${getStatusBg(data.lock)} rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              {data.lock ? (
                <Lock className="w-8 h-8 text-green-400" />
              ) : (
                <Unlock className="w-8 h-8 text-red-400" />
              )}
              <div className={`p-2 rounded-full ${data.lock ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                {data.lock ? (
                  <Lock className="w-4 h-4 text-green-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Security</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {data.lock ? "LOCKED" : "UNLOCKED"}
            </div>
            <p className={`text-sm ${data.lock ? 'text-green-300' : 'text-red-300'}`}>
              Door {data.lock ? 'Secured' : 'Unsecured'}
            </p>
          </div>

          {/* System Status */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">LIVE</div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">System Status</h3>
            <div className="text-2xl font-bold text-green-400 mb-1">ONLINE</div>
            <p className="text-sm text-green-300">All systems operational</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-gray-300">Auto-refresh every second</span>
          </div>
        </div>
      </div>
    </div>
  );
}