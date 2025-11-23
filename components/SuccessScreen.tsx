import React, { useEffect, useState } from 'react';
import { getAttendeesAsync } from '../services/db';
import { Attendee } from '../types';

export const SuccessScreen: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
            
            <div className="overflow-x-auto hidden md:block">
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
                        {attendees
                          .slice((page - 1) * pageSize, page * pageSize)
                          .map((a) => (
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
            <div className="md:hidden space-y-3">
              {attendees
                .slice((page - 1) * pageSize, page * pageSize)
                .map((a) => (
                  <div key={a.id} className="bg-white border border-christmas-green rounded-xl p-3">
                    <div className="font-bold text-black">{a.firstName} {a.lastName}</div>
                    <div className="text-sm text-black">{a.career}</div>
                    <div className="text-sm text-red-600 font-bold">{a.contribution}</div>
                    <div className="text-xs text-black">Ciclo {a.cycle}</div>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/10 text-black border border-christmas-red px-4 py-2 rounded disabled:opacity-50"
              >Anterior</button>
              <span className="text-sm text-black">
                Página {page} de {Math.max(1, Math.ceil(attendees.length / pageSize))}
              </span>
              <button
                onClick={() => setPage((p) => (p < Math.ceil(attendees.length / pageSize) ? p + 1 : p))}
                disabled={page >= Math.ceil(attendees.length / pageSize)}
                className="bg-white/10 text-black border border-christmas-red px-4 py-2 rounded disabled:opacity-50"
              >Siguiente</button>
            </div>
            {attendees.length === 0 && <p className="text-center text-gray-500 mt-4">Nadie ha confirmado, eres el primero xd</p>}
        </div>
      </div>
    </div>
  );
};
