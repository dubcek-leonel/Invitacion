import React, { useEffect, useState } from 'react';
import { getAttendeesAsync } from '../services/db';
import { Attendee } from '../types';

export const SuccessScreen: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    (async () => {
      const list = await getAttendeesAsync();
      setAttendees(list);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-green-800 via-red-800 to-green-900 text-center pb-32">
      <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8 drop-shadow-lg animate-wiggle mt-8">
        ¡YA ESTÁS DENTRO MAQUINOLA!
      </h2>
      
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border-4 border-yellow-400 shadow-[0_0_30px_rgba(255,255,0,0.5)] max-w-4xl w-full">
        <p className="text-2xl text-white mb-6 font-comic">
            Prepara ese biscocho porque se va a remojar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-xl text-green-400 font-bold">📅 FECHA</h3>
            <p className="text-2xl text-white">25 de Diciembre, 3:00 AM</p>
          </div>

          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-xl text-red-400 font-bold">📍 UBICACIÓN</h3>
            <p className="text-3xl text-yellow-300 font-bold animate-pulse">
              🏰 PAPULANDIA 🏰
            </p>
            <p className="text-sm text-gray-300 mt-2">(Donde la tía veneno)</p>
          </div>
        </div>

        <div className="bg-white/90 rounded-xl p-4 text-left">
            <h3 className="text-2xl text-christmas-red font-bold mb-4 text-center border-b-2 border-christmas-green pb-2">
                📋 LISTA DE LA GENTE FIRME
            </h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                    <thead className="bg-christmas-green text-white">
                        <tr>
                            <th className="p-3 rounded-tl-lg">Nombre</th>
                            <th className="p-3">Carrera</th>
                            <th className="p-3">Trae</th>
                            <th className="p-3 rounded-tr-lg">Ciclo</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {attendees.map((a) => (
                            <tr key={a.id} className="border-b border-gray-200 hover:bg-red-50">
                                <td className="p-3 font-bold">{a.firstName} {a.lastName}</td>
                                <td className="p-3">{a.career}</td>
                                <td className="p-3 text-red-600 font-bold">{a.contribution}</td>
                                <td className="p-3 text-center">{a.cycle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {attendees.length === 0 && <p className="text-center text-gray-500 mt-4">Nadie ha confirmado, eres el primero xd</p>}
        </div>
      </div>
    </div>
  );
};