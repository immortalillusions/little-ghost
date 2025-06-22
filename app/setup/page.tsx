"use server";
import SetupButton from './SetupButton';

export default async function Setup() {
  console.log("setup")
  // const data = await fetchData();
  // console.log("Data fetched:", data);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/30 p-8 pb-20 sm:p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-6xl animate-bounce">🎃</span>
            <h1 className="text-5xl font-bold text-white">
              Séance Setup
            </h1>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎃</span>
          </div>
          <p className="text-purple-300 text-xl opacity-80 max-w-2xl mx-auto">
            Commune with the spirits to configure your haunted home devices. 
            Each phantom requires proper positioning to respond to your commands.
          </p>
          <div className="mt-4 text-orange-400 text-sm opacity-70">
            ⚠️ Warning: Supernatural activity detected during setup rituals ⚠️
          </div>
        </div>

        {/* Setup Cards Container */}
        <div className="flex flex-wrap justify-center gap-8">
          <div className="transform hover:scale-105 transition-all duration-300">
            <SetupButton type="thermostat" />
          </div>
          <div className="transform hover:scale-105 transition-all duration-300">
            <SetupButton type="lock" />
          </div>
          <div className="transform hover:scale-105 transition-all duration-300">
            <SetupButton type="light" />
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-900/60 border border-purple-500/30 rounded-lg p-8 shadow-lg shadow-purple-500/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📜</span>
              <h2 className="text-2xl font-bold text-white">Ritual Instructions</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-300">
              <div className="text-center">
                <div className="text-2xl mb-2">🔮</div>
                <h3 className="font-semibold text-purple-300 mb-2">Step 1: Invoke</h3>
                <p className="text-sm">Click on a device button to begin the summoning ritual</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👁️</div>
                <h3 className="font-semibold text-purple-300 mb-2">Step 2: Listen</h3>
                <p className="text-sm">The spirits will reveal device positions for 5 seconds</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-purple-300 mb-2">Step 3: Bind</h3>
                <p className="text-sm">The final position will be bound to your device</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 text-xl opacity-20 animate-bounce" style={{ animationDuration: '6s' }}>
            🕷️
          </div>
          <div className="absolute top-1/3 right-16 text-lg opacity-15 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>
            🦇
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-xl opacity-25 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            👻
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-lg opacity-20 animate-bounce" style={{ animationDuration: '8s', animationDelay: '3s' }}>
            🔮
          </div>
        </div>
      </div>
    </div>
  );
}