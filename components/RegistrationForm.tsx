import React, { useState } from 'react';
import { Attendee } from '../types';
import { saveAttendee, banUser } from '../services/db';

interface RegistrationFormProps {
  onSuccess: () => void;
  onBan: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onBan }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cycle, setCycle] = useState('');
  const [career, setCareer] = useState('');
  const [contribution, setContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate checking database/IP logic with a delay
    setTimeout(() => {
        // KEVIN MARCA LOGIC
        if (firstName.trim().toLowerCase() === 'kevin' && lastName.trim().toLowerCase().includes('marca')) {
          banUser();
          onBan();
        } else {
          const attendee: Omit<Attendee, 'id' | 'timestamp'> = {
            firstName,
            lastName,
            cycle,
            career,
            contribution,
          };
          saveAttendee(attendee);
          onSuccess();
        }
        setIsLoading(false);
    }, 3000); // 3 seconds delay for suspense
  };

  if (isLoading) {
    return (
        <div className="w-full max-w-lg mx-auto bg-black/80 backdrop-blur-md border-4 border-yellow-500 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-8 relative rounded-3xl flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="text-6xl animate-spin mb-6">🍪</div>
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 animate-pulse">
                ESPERA UN TOQUE...
            </h2>
            <p className="text-xl text-white mt-4 font-bold">
                Confirmando que no eres Kevin Marca...
            </p>
            <div className="mt-8 w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div className="bg-green-500 h-4 rounded-full animate-[marquee_2s_linear_infinite]" style={{width: '50%'}}></div>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-md border-4 border-christmas-red p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-8 relative rounded-3xl">
        {/* Christmas Decorations */}
        <div className="absolute -top-6 -left-6 text-6xl animate-wiggle z-20">🎁</div>
        <div className="absolute -bottom-6 -right-6 text-6xl animate-bounce z-20">🧦</div>

      <h2 className="text-3xl text-center text-christmas-red mb-8 font-bold uppercase border-b-4 border-christmas-green pb-4 tracking-widest">
        📝 LISTA DE INVITADOS
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-christmas-green font-bold mb-2 text-lg">Nombre:</label>
                <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 bg-gray-100 border-2 border-christmas-green text-black focus:outline-none focus:ring-4 focus:ring-christmas-gold rounded-xl transition-all"
                    placeholder="Tu gracia"
                />
            </div>
            <div>
                <label className="block text-christmas-green font-bold mb-2 text-lg">Apellido:</label>
                <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 bg-gray-100 border-2 border-christmas-green text-black focus:outline-none focus:ring-4 focus:ring-christmas-gold rounded-xl transition-all"
                    placeholder="Tu desgracia"
                />
            </div>
        </div>

        <div>
          <label className="block text-christmas-red font-bold mb-2 text-lg">Ciclo:</label>
          <select
            required
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            className="w-full p-3 bg-gray-100 border-2 border-christmas-red text-black focus:outline-none focus:ring-4 focus:ring-christmas-gold rounded-xl transition-all"
          >
            <option value="">Selecciona tu ciclo causa</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Ciclo {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-christmas-green font-bold mb-2 text-lg">Carrera:</label>
          <input
            type="text"
            required
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="w-full p-3 bg-gray-100 border-2 border-christmas-green text-black focus:outline-none focus:ring-4 focus:ring-christmas-gold rounded-xl transition-all"
            placeholder="como soldadura de madera"
          />
        </div>

        <div className="bg-christmas-red/10 p-4 rounded-xl border border-christmas-red">
          <label className="block text-christmas-red font-bold mb-2 text-xl flex items-center gap-2">
            <span>🎅</span> ¿Qué vas a traer? <span className="text-xs font-normal">(OBLIGATORIO)</span>
          </label>
          <input
            type="text"
            required
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            className="w-full p-3 bg-white border-2 border-christmas-red text-black focus:outline-none focus:ring-4 focus:ring-christmas-gold rounded-xl placeholder-red-300 font-bold"
            placeholder="si traes bell's no entras"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-christmas-green hover:bg-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-[0_4px_0_rgb(0,50,0)] active:shadow-none active:translate-y-1 transition-all text-xl uppercase mt-4 border-2 border-white/20"
        >
          🎄 Confirmar Asistencia 🎄
        </button>
      </form>
    </div>
  );
};