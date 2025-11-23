import React from 'react';

export const ShitpostHeader: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6 border-b-8 border-christmas-gold border-double bg-christmas-red shadow-lg relative overflow-hidden">
      {/* Decorative Snowflakes */}
      <div className="absolute top-2 left-4 text-4xl animate-spin-slow opacity-50">❄️</div>
      <div className="absolute top-4 right-10 text-3xl animate-bounce opacity-50">❄️</div>

      <h1 className="text-4xl md:text-7xl font-bold text-christmas-gold animate-float text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase">
        🎅 REMOJA TU BISCOCHO 3000 🎅
      </h1>
      <p className="text-2xl text-white bg-christmas-green px-6 py-2 rounded-full border-2 border-christmas-gold shadow-md transform -rotate-1 font-bold">
        🎄 100% REAL, 0 SAPOS 🎄
      </p>
    </div>
  );
};
