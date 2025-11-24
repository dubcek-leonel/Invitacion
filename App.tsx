import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ShitpostHeader } from './components/ShitpostHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { BannedScreen } from './components/BannedScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { Footer } from './components/Footer';
import BackgroundMusic from './components/BackgroundMusic';
import { isUserBanned, isNameBanned, getCurrentUser } from './services/db';
import { Admin } from './components/Admin';

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserBanned()) {
      navigate('/baneado', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    (async () => {
      const cu = getCurrentUser();
      if (cu) {
        const banned = await isNameBanned(cu.firstName, cu.lastName);
        if (banned) {
          navigate('/baneado', { replace: true });
        }
      }
    })();
  }, [navigate]);

  const handleSuccess = () => {
    navigate('/lista');
  };

  const handleBan = () => {
    navigate('/baneado');
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1576919224236-8182f1837648?q=80&w=2070&auto=format&fit=crop')] bg-fixed bg-cover bg-center relative pb-24 overflow-hidden font-comic">
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>
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
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/baneado" element={<BannedScreen />} />
          <Route path="/lista" element={<SuccessScreen />} />
          <Route path="/" element={
            <>
              <ShitpostHeader />
              <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-red-900/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-500/50 shadow-2xl text-center mb-8 animate-float">
                    <p className="text-white text-xl md:text-2xl font-bold drop-shadow-md">🔥 Chocolatada caliente o Sideral Frio 🧊</p>
                    <p className="text-yellow-400 text-md mt-2 font-bold uppercase tracking-wider">NADA DE PANETÓN DE 5 SO O PANETON UNION :V. TRAE TU TASA O TOMAS EN BOLSA. SI SOS SAPO TE VAS BANEAO! 🧯</p>
                  </div>
                  {getCurrentUser() && (
                    <div className="bg-black/50 text-white rounded-2xl p-4 border-2 border-yellow-400 mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      <div className="text-base sm:text-lg">📅 29 de Noviembre</div>
                      <button onClick={() => navigate('/lista')} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl border-2 border-black">
                        Ver lista
                      </button>
                    </div>
                  )}
                  <RegistrationForm onSuccess={handleSuccess} onBan={handleBan} />
                </div>
              </main>
            </>
          } />
        </Routes>
      </div>
      <BackgroundMusic youtubeId="fLBqYX3ltqs" autoplay={true} />
      <Footer />
    </div>
  );
};

export default App;
