import React, { useState } from 'react';

export const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hola! ¿Qué quieres saber?' },
  ]);
  const [disabled, setDisabled] = useState(false);

  const sendUser = (text: string) => {
    setMessages((m) => [...m, { from: 'user', text }]);
  };

  const sendBot = (text: string) => {
    setMessages((m) => [...m, { from: 'bot', text }]);
  };

  const handleChoice = (choice: 'direccion' | 'hora') => {
    if (disabled) return;
    setDisabled(true);
    if (choice === 'direccion') {
      sendUser('1 - Dirección');
      setTimeout(() => {
        sendBot('La dirección es: Salida a Cusco, Final de la Linea 30 (Preguntar al Admin por mas info)');
        setDisabled(false);
      }, 600);
    } else {
      sendUser('2 - Hora');
      setTimeout(() => {
        sendBot('La hora es: 15:00 (3:00 PM) el 29 de Noviembre. Llega temprano, estaremos hasta las ultimas consecuencias!');
        setDisabled(false);
      }, 600);
    }
  };

  return (
    <div className="fixed right-4 bottom-20 sm:bottom-24 z-[60]">
      {!open ? (
        <button
          aria-label="Abrir chat"
          onClick={() => setOpen(true)}
          className="bg-yellow-400 text-black px-4 py-3 rounded-full shadow-lg font-bold"
        >
          💬 Preguntar
        </button>
      ) : (
        <div className="w-80 max-w-[90vw] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-yellow-400 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-yellow-400 text-black font-bold">
            <div>Asistente</div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Minimizar chat"
                onClick={() => setOpen(false)}
                className="px-2 py-1 bg-black/10 rounded"
              >
                _
              </button>
              <button
                aria-label="Cerrar chat"
                onClick={() => { setOpen(false); setMessages([{ from: 'bot', text: 'Hola! ¿Qué quieres saber?'}]); }}
                className="px-2 py-1 bg-black/10 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 max-h-56 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'bot' ? 'text-left text-sm text-black' : 'text-right text-sm text-black'}>
                <div className={`${m.from === 'bot' ? 'inline-block bg-gray-100 text-black' : 'inline-block bg-yellow-300 text-black'} px-3 py-2 rounded-lg`}> {m.text} </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/30 bg-white/90">
            <div className="flex gap-2">
              <button
                onClick={() => handleChoice('direccion')}
                disabled={disabled}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded disabled:opacity-50"
              >
                1. Dirección
              </button>
              <button
                onClick={() => handleChoice('hora')}
                disabled={disabled}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
              >
                2. Hora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
