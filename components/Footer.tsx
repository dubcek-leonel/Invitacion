import React from 'react';

export const Footer: React.FC = () => {
  const content = (
    <div className="flex items-center gap-8 px-4">
      <span className="text-3xl font-black uppercase text-yellow-300 drop-shadow-md tracking-widest whitespace-nowrap">🚫 PROHIBIDO KEVIN MARCA 🚫</span>
      <span className="text-xl font-bold whitespace-nowrap text-white">🎅 EN ESPECIAL TÚ, KEVIN MARCA HUAMAN 🎅</span>
      <span className="text-2xl font-black uppercase text-green-300 drop-shadow-md whitespace-nowrap">🎄 FELIZ NAVIDAD (MENOS A TI KEVIN MARCA) 🎄</span>
      <span className="text-3xl font-black uppercase text-yellow-300 drop-shadow-md tracking-widest whitespace-nowrap">🚫 PROHIBIDO KEVIN MARCA 🚫</span>
      <span className="text-xl font-bold whitespace-nowrap text-white">🎄 SI TE LLAMAS KEVIN, NO ENTRES 🎄</span>
      <span className="text-3xl font-black uppercase text-yellow-300 drop-shadow-md tracking-widest whitespace-nowrap">🚫 FUERA KEVIN 🚫</span>
      <span className="text-xl font-bold whitespace-nowrap text-white">🎁 KEVIN MARCA HUAMAN NO ESTÁS INVITADO 🎁</span>
    </div>
  );

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-christmas-red border-t-4 border-christmas-gold text-white h-16 z-50 overflow-hidden shadow-[0_-5px_10px_rgba(0,0,0,0.5)] flex items-center">
      {/* Wrapper to ensure seamless loop without gaps */}
      <div className="flex w-max animate-marquee-infinite">
        {content}
        {content}
        {content}
      </div>
    </footer>
  );
};