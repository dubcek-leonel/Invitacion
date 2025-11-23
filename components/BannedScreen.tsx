import React from 'react';

export const BannedScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-red-900 z-50 flex flex-col items-center justify-center text-center p-4 overflow-hidden">
      <h1 className="text-6xl md:text-9xl font-bold text-black bg-red-500 p-8 border-8 border-yellow-400 animate-bounce">
        🚨 ALERTA 🚨
      </h1>
      <h2 className="text-4xl md:text-6xl font-bold text-white mt-8 mb-4 uppercase tracking-widest">
        KEVIN MARCA DETECTADO
      </h2>
      <p className="text-2xl text-yellow-300 mb-8">
        TU IP HA SIDO BLOQUEADA POR EL SISTEMA DE SEGURIDAD "ANTI-FUNADOS 3000"
      </p>
      <img 
        src="https://picsum.photos/400/300?random=3" 
        alt="Police" 
        className="border-8 border-black w-full max-w-md grayscale contrast-200"
      />
      <div className="mt-12 animate-pulse text-5xl">
        🚫 🚫 🚫
      </div>
    </div>
  );
};