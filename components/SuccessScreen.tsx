import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendeesAsync } from '../services/db';
import Chatbot from './Chatbot';
import { Attendee } from '../types';

export const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(attendees.length / pageSize));
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(attendees.length, page * pageSize);
  useEffect(() => {
    const t = Math.max(1, Math.ceil(attendees.length / pageSize));
    setPage((p) => Math.min(p, t));
  }, [attendees.length]);

  useEffect(() => {
    (async () => {
      const list = await getAttendeesAsync();
      setAttendees(list);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-green-800 via-red-800 to-green-900 text-center pb-32">
      <button
        aria-label="Volver al formulario"
        onClick={() => navigate('/')}
        className="fixed top-3 left-3 z-50 bg-black/60 text-white border border-white/20 rounded-full px-3 py-2 text-sm md:text-base hover:bg-black/80"
      >
        ← Volver
      </button>
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
            <p className="text-2xl text-white">29 de Noviembre</p>
          </div>

          <div className="bg-black/50 p-4 rounded-lg">
            <h3 className="text-xl text-red-400 font-bold">📍 UBICACIÓN</h3>
            <p className="text-3xl text-yellow-300 font-bold animate-pulse">
              🏰 Salida a Cusco, Final de la Linea 30  🏰
            </p>
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
                                <td className="p-3 font-bold whitespace-normal break-words">{a.firstName} {a.lastName}</td>
                                <td className="p-3 whitespace-normal break-words">{a.career}</td>
                                <td className="p-3 text-red-600 font-bold whitespace-normal break-words" style={{ overflowWrap: 'anywhere' }}>{a.contribution}</td>
                                <td className="p-3 text-center whitespace-normal break-words">{a.cycle}</td>
                          </tr>
                        ))}
                </tbody>
            </table>
            </div>
            <div className="md:hidden space-y-2">
              {attendees
                .slice((page - 1) * pageSize, page * pageSize)
                .map((a) => (
                  <div key={a.id} className="bg-white rounded-xl border border-christmas-green p-3 relative overflow-hidden pr-12">
                    <div className="text-sm text-black whitespace-normal break-words" style={{ overflowWrap: 'anywhere' }}>
                      <span className="text-gray-500 font-semibold">Nombre:</span> <span className="font-bold">{a.firstName}</span>
                    </div>
                    <div className="text-sm text-black whitespace-normal break-words" style={{ overflowWrap: 'anywhere' }}>
                      <span className="text-gray-500 font-semibold">Apellido:</span> <span className="font-bold">{a.lastName}</span>
                    </div>
                    <div className="text-xs text-gray-700 whitespace-normal break-words mt-0.5" style={{ overflowWrap: 'anywhere' }}>
                      <span className="text-gray-500 font-semibold">Carrera:</span> {a.career}
                    </div>
                    <div className="mt-2 relative">
                      <div className="text-[11px] text-gray-700"><span className="font-semibold">Trae:</span></div>
                      <div className="text-xs text-red-600 font-bold whitespace-normal break-words overflow-hidden" style={{ lineHeight: '1.3em', maxHeight: (!expanded[a.id] && a.contribution && a.contribution.length > 60) ? '2.6em' : 'none', overflowWrap: 'anywhere' }}>
                        {a.contribution}
                      </div>
                      {(!expanded[a.id] && a.contribution && a.contribution.length > 60) && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent"></div>
                      )}
                      {(a.contribution && a.contribution.length > 60) && (
                        <button
                          aria-expanded={!!expanded[a.id]}
                          className="text-[12px] font-medium text-blue-600 underline mt-1 hover:text-blue-700 active:text-blue-800"
                          onClick={() => setExpanded((e) => ({...e, [a.id]: !e[a.id]}))}
                        >
                          {expanded[a.id] ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </div>
                    <span className="absolute top-2 right-2 inline-block bg-christmas-green text-white text-xs font-bold px-2 py-1 rounded">Ciclo {a.cycle}</span>
                  </div>
                ))}
            </div>
            <div className="mt-4 hidden md:flex items-center justify-end gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/10 text-black border border-christmas-red px-4 py-2 rounded disabled:opacity-50"
              >Anterior</button>
              <span className="text-sm text-black">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages}
                className="bg-white/10 text-black border border-christmas-red px-4 py-2 rounded disabled:opacity-50"
              >Siguiente</button>
            </div>
            <div className="md:hidden mt-3">
              <div className="bg-white border border-christmas-red rounded-xl p-2 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-christmas-green text-white px-3 py-1 rounded disabled:opacity-50 text-xs"
                >Anterior</button>
                <span className="text-xs text-black">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page >= totalPages}
                  className="bg-christmas-green text-white px-3 py-1 rounded disabled:opacity-50 text-xs"
                >Siguiente</button>
              </div>
            </div>
            {attendees.length === 0 && <p className="text-center text-gray-500 mt-4">Nadie ha confirmado, eres el primero xd</p>}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};