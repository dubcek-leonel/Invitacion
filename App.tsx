import React, { useState, useEffect } from 'react';
import { ShitpostHeader } from './components/ShitpostHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { BannedScreen } from './components/BannedScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { Footer } from './components/Footer';
import { AppState } from './types';
import { isUserBanned } from './services/db';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.FORM);

  useEffect(() => {
    if (isUserBanned()) {
      setView(AppState.BANNED);
    }
  }, []);

  const handleSuccess = () => {
    setView(AppState.SUCCESS);
  };

  const handleBan = () => {
    setView(AppState.BANNED);
  };

  if (view === AppState.BANNED) {
    return <BannedScreen />;
  }

  return (
    // Updated background to warm lights/fireworks vibe (Navidad Peruana vibe) instead of cold snow
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1576919224236-8182f1837648?q=80&w=2070&auto=format&fit=crop')] bg-fixed bg-cover bg-center relative pb-24 overflow-hidden font-comic">
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
      
      {/* Falling Snow Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {Array.from({ length: 50 }).map((_, i) => (
             <div 
                key={i} 
                className="absolute top-[-20px] text-white text-2xl animate-snow-fall" 
                style={{ 
                 left: `${Math.random() * 100}%`,
                 animationDuration: `${Math.random() * 5 + 5}s`, 
                 animationDelay: `${Math.random() * 5}s`,
                 opacity: Math.random(),
                 fontSize: `${Math.random() * 20 + 10}px`
             }}>❄️</div>
         ))}
      </div>

      <div className="relative z-10">
        {view === AppState.SUCCESS ? (
          <SuccessScreen />
        ) : (
          <>
            <ShitpostHeader />
            <main className="container mx-auto px-4 py-8">
              <div className="max-w-3xl mx-auto">
                  <div className="bg-red-900/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-500/50 shadow-2xl text-center mb-8 animate-float">
                      <p className="text-white text-xl md:text-2xl font-bold drop-shadow-md">
                          ¡Habla causa! ¿Vas a bajar a la chocolatada o te vas a botar?
                      </p>
                      <p className="text-yellow-400 text-md mt-2 font-bold uppercase tracking-wider">
                          Nada de panetón de 5 soles ni chocolate aguado. Trae tu tasa o tomas en bolsa.
                      </p>
                  </div>
                <RegistrationForm onSuccess={handleSuccess} onBan={handleBan} />
              </div>
            </main>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;