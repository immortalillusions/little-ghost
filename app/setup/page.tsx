"use server";

import SetupButton from './SetupButton';

export default async function Setup() {
  console.log("setup")
  // const data = await fetchData();
  // console.log("Data fetched:", data);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-white mb-4">Device Setup</h1>
          <p className="text-blue-200 text-lg">Configure your smart home devices by positioning them and clicking to calibrate</p>
          <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm max-w-3xl mx-auto">
            <div className="text-blue-100">
              <strong>Instructions:</strong> Position each device physically, then click the corresponding button below. 
              The system will listen for 5 seconds to detect and save the device's position.
            </div>
          </div>
        </div>

        {/* Setup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <SetupButton type="thermostat" />
          <SetupButton type="lock" />
          <SetupButton type="light" />
        </div>

        {/* Footer Help */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-sm text-gray-300">Need help? Make sure devices are powered on and within range</span>
          </div>
        </div>
      </div>
    </div>
  );
}