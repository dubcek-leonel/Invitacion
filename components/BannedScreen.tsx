import React, { useState } from 'react';
import { addAppeal, getCurrentUser } from '../services/db';

export const BannedScreen: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identity = getCurrentUser();
    if (!message.trim()) return;
    const f = (identity?.firstName ?? firstName).trim();
    const l = (identity?.lastName ?? lastName).trim();
    if (!f || !l) return;
    setBusy(true);
    await addAppeal({ firstName: f, lastName: l, message: message.trim() });
    setSent(true);
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 bg-red-900 z-[60] flex flex-col items-center justify-center text-center p-4 overflow-hidden">
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
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl border-4 border-black"
      >
        Apelar
      </button>
      <div className="mt-12 animate-pulse text-5xl">
        🚫 🚫 🚫
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" style={{ zIndex: 70 }}>
          <div className="bg-white/95 text-black border-4 border-christmas-red p-6 rounded-2xl shadow-xl w-full max-w-xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-800 text-white font-bold px-3 py-1 rounded"
            >
              X
            </button>
            {!sent ? (
              <form onSubmit={onSubmit} className="space-y-4 text-left">
                <h3 className="text-xl font-bold text-christmas-red mb-2">Apelación</h3>
                {getCurrentUser() ? (
                  <div className="w-full p-3 bg-gray-100 border-2 border-christmas-green rounded-xl text-black">
                    <div className="text-sm">Remitente: <span className="font-bold">{getCurrentUser()!.firstName} {getCurrentUser()!.lastName}</span></div>
                  </div>
                ) : (
                  <>
                    <input
                      className="w-full p-3 bg-gray-100 border-2 border-christmas-green rounded-xl"
                      placeholder="Nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      className="w-full p-3 bg-gray-100 border-2 border-christmas-green rounded-xl"
                      placeholder="Apellido"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </>
                )}
                <textarea
                  className="w-full p-3 bg-gray-100 border-2 border-christmas-green rounded-xl min-h-[120px]"
                  placeholder="Explica por qué deberías ser desbaneado"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={busy} className="w-full bg-christmas-green hover:bg-green-800 text-white font-bold py-3 rounded-xl">
                  Enviar apelación
                </button>
              </form>
            ) : (
              <div>
                <p className="text-lg">Tu apelación fue enviada. El admin la revisará.</p>
                <button onClick={() => setShowForm(false)} className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-xl border-2 border-black">
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
