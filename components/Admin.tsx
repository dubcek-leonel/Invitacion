import React, { useEffect, useMemo, useState } from 'react';
import { addBan, listBans, removeBan, listAppeals, updateAppealStatus, unbanUser, getAttendeesAsync, removeBanByName, isNameBanned, removeAttendee, archiveAttendee, getArchivedByName, removeArchivedByName, saveAttendee } from '../services/db';
import type { Ban } from '../types';
import type { Appeal } from '../types';
import type { Attendee } from '../types';

export const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === 'true');
  const [password, setPassword] = useState('');
  const requiredPassword = useMemo(() => (import.meta.env.VITE_ADMIN_PASSWORD as string) || 'changeme', []);
  const [bans, setBans] = useState<Ban[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [activeTab, setActiveTab] = useState<'attendees' | 'bans' | 'appeals'>('attendees');
  const [busy, setBusy] = useState(false);
  const [attendeesPage, setAttendeesPage] = useState(1);
  const [bansPage, setBansPage] = useState(1);
  const [appealsPage, setAppealsPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    const data = await listBans();
    setBans(data);
    const ap = await listAppeals();
    setAppeals(ap);
    const at = await getAttendeesAsync();
    setAttendees(at);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  useEffect(() => {
    if (activeTab === 'attendees') setAttendeesPage(1);
    if (activeTab === 'bans') setBansPage(1);
    if (activeTab === 'appeals') setAppealsPage(1);
  }, [activeTab]);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === requiredPassword) {
      sessionStorage.setItem('admin_authed', 'true');
      setAuthed(true);
    }
  };

  

  const onRemove = async (id: string) => {
    setBusy(true);
    const b = bans.find((x) => x.id === id);
    await removeBan(id);
    if (b) {
      const archived = getArchivedByName(b.firstName, b.lastName);
      if (archived) {
        await saveAttendee({
          firstName: archived.firstName,
          lastName: archived.lastName,
          cycle: archived.cycle,
          career: archived.career,
          contribution: archived.contribution,
        });
        removeArchivedByName(b.firstName, b.lastName);
      }
    }
    await load();
    setBusy(false);
  };

  const onApproveAppeal = async (id: string) => {
    setBusy(true);
    const ap = appeals.find((a) => a.id === id);
    await updateAppealStatus(id, 'APPROVED');
    if (ap) {
      await removeBanByName(ap.firstName, ap.lastName);
      const archived = getArchivedByName(ap.firstName, ap.lastName);
      if (archived) {
        await saveAttendee({
          firstName: archived.firstName,
          lastName: archived.lastName,
          cycle: archived.cycle,
          career: archived.career,
          contribution: archived.contribution,
        });
        removeArchivedByName(ap.firstName, ap.lastName);
      }
    }
    unbanUser();
    await load();
    setBusy(false);
  };

  const onRejectAppeal = async (id: string) => {
    setBusy(true);
    await updateAppealStatus(id, 'REJECTED');
    await load();
    setBusy(false);
  };

  const onBanAttendee = async (a: Attendee) => {
    setBusy(true);
    const banned = await isNameBanned(a.firstName, a.lastName);
    if (!banned) {
      await addBan({ firstName: a.firstName, lastName: a.lastName, reason: 'admin' });
      archiveAttendee(a);
      await removeAttendee(a.id);
    }
    await load();
    setBusy(false);
  };

  const onUnbanAttendee = async (a: Attendee) => {
    setBusy(true);
    await removeBanByName(a.firstName, a.lastName);
    await load();
    setBusy(false);
  };

  const onAdminLogout = () => {
    sessionStorage.removeItem('admin_authed');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/60 p-6">
        <form onSubmit={onLogin} className="bg-white/95 border-4 border-christmas-red p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-christmas-red mb-6">Acceso Admin</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 bg-gray-100 border-2 border-christmas-green rounded-xl mb-4 text-black"
          />
          <button type="submit" className="w-full bg-christmas-green hover:bg-green-800 text-white font-bold py-3 rounded-xl">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-800 via-red-800 to-green-900 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button onClick={onAdminLogout} className="bg-red-600 hover:bg-red-800 text-white font-bold px-3 py-2 rounded border-2 border-white/20">Cerrar sesión</button>
      </div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('attendees')} className={`px-4 py-2 rounded ${activeTab==='attendees'?'bg-yellow-400 text-black':'bg-white/10 text-white border border-white/20'}`}>Asistentes</button>
        <button onClick={() => setActiveTab('bans')} className={`px-4 py-2 rounded ${activeTab==='bans'?'bg-yellow-400 text-black':'bg-white/10 text-white border border-white/20'}`}>Lista de baneados</button>
        <button onClick={() => setActiveTab('appeals')} className={`px-4 py-2 rounded ${activeTab==='appeals'?'bg-yellow-400 text-black':'bg-white/10 text-white border border-white/20'}`}>Apelaciones</button>
      </div>

      {activeTab === 'attendees' && (
      <div className="bg-white/10 border-2 border-yellow-400 rounded-2xl p-4 mb-8">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Asistentes</h3>
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Carrera</th>
                <th className="p-2">Ciclo</th>
                  <th className="p-2">Trae</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {attendees
                .slice((attendeesPage - 1) * pageSize, attendeesPage * pageSize)
                .map((a) => {
                const banned = bans.some(
                  (b) =>
                    b.firstName.toLowerCase() === a.firstName.toLowerCase() &&
                    b.lastName.toLowerCase() === a.lastName.toLowerCase()
                );
                return (
                  <tr key={a.id} className="border-b border-white/20">
                    <td className="p-2">{a.firstName}</td>
                    <td className="p-2">{a.lastName}</td>
                    <td className="p-2">{a.career}</td>
                    <td className="p-2">{a.cycle}</td>
                      <td className="p-2">{a.contribution}</td>
                      <td className="p-2">{banned ? 'BANEADO' : 'OK'}</td>
                    <td className="p-2 flex gap-2">
                      {!banned ? (
                        <button disabled={busy} onClick={() => onBanAttendee(a)} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded">
                          Banear
                        </button>
                      ) : (
                        <button disabled={busy} onClick={() => onUnbanAttendee(a)} className="bg-green-600 hover:bg-green-800 text-white font-bold py-1 px-3 rounded">
                          Desbanear
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {attendees.length === 0 && (
                <tr>
                  <td className="p-2 text-center text-gray-200" colSpan={7}>Sin asistentes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {attendees
            .slice((attendeesPage - 1) * pageSize, attendeesPage * pageSize)
            .map((a) => {
              const banned = bans.some(
                (b) =>
                  b.firstName.toLowerCase() === a.firstName.toLowerCase() &&
                  b.lastName.toLowerCase() === a.lastName.toLowerCase()
              );
              return (
                <div key={a.id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <div>
                    <div className="text-xs uppercase text-gray-300">Nombre</div>
                    <div className="font-bold truncate">{a.firstName} {a.lastName}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-gray-300">Carrera</div>
                    <div className="truncate">{a.career}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-gray-300">Ciclo</div>
                    <div>Ciclo {a.cycle}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-gray-300">Trae</div>
                    <div className="truncate">{a.contribution}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-gray-300">Estado</div>
                    <div>{banned ? 'BANEADO' : 'OK'}</div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {!banned ? (
                      <button disabled={busy} onClick={() => onBanAttendee(a)} className="bg-red-600 text-white font-bold py-2 px-3 rounded w-full">Banear</button>
                    ) : (
                      <button disabled={busy} onClick={() => onUnbanAttendee(a)} className="bg-green-600 text-white font-bold py-2 px-3 rounded w-full">Desbanear</button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="md:hidden mt-3 flex items-center justify-between">
          <button
            onClick={() => setAttendeesPage((p) => Math.max(1, p - 1))}
            disabled={attendeesPage === 1}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-xs">Página {attendeesPage} de {Math.max(1, Math.ceil(attendees.length / pageSize))}</span>
          <button
            onClick={() => setAttendeesPage((p) => (p < Math.ceil(attendees.length / pageSize) ? p + 1 : p))}
            disabled={attendeesPage >= Math.ceil(attendees.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setAttendeesPage((p) => Math.max(1, p - 1))}
            disabled={attendeesPage === 1}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-sm">
            Página {attendeesPage} de {Math.max(1, Math.ceil(attendees.length / pageSize))}
          </span>
          <button
            onClick={() => setAttendeesPage((p) => (p < Math.ceil(attendees.length / pageSize) ? p + 1 : p))}
            disabled={attendeesPage >= Math.ceil(attendees.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
      </div>
      )}

      

      {activeTab === 'bans' && (
      <div className="bg-white/10 border-2 border-yellow-400 rounded-2xl p-4">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Listado de baneos</h3>
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Motivo</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {bans
                .slice((bansPage - 1) * pageSize, bansPage * pageSize)
                .map((b) => (
                <tr key={b.id} className="border-b border-white/20">
                  <td className="p-2">{b.firstName}</td>
                  <td className="p-2">{b.lastName}</td>
                  <td className="p-2">{b.reason}</td>
                  <td className="p-2">{new Date(b.timestamp).toLocaleString()}</td>
                  <td className="p-2">
                    <button disabled={busy} onClick={() => onRemove(b.id)} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded">
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
              {bans.length === 0 && (
                <tr>
                  <td className="p-2 text-center text-gray-200" colSpan={5}>Sin registros</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {bans
            .slice((bansPage - 1) * pageSize, bansPage * pageSize)
            .map((b) => (
              <div key={b.id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                <div>
                  <div className="text-xs uppercase text-gray-300">Nombre</div>
                  <div className="font-bold truncate">{b.firstName} {b.lastName}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs uppercase text-gray-300">Motivo</div>
                  <div className="truncate">{b.reason}</div>
                </div>
                <div className="mt-2 text-xs">{new Date(b.timestamp).toLocaleString()}</div>
                <div className="mt-2">
                  <button disabled={busy} onClick={() => onRemove(b.id)} className="bg-red-600 text-white font-bold py-2 px-3 rounded w-full">Quitar</button>
                </div>
              </div>
            ))}
        </div>
        <div className="md:hidden mt-3 flex items-center justify-between">
          <button
            onClick={() => setBansPage((p) => Math.max(1, p - 1))}
            disabled={bansPage === 1}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-xs">Página {bansPage} de {Math.max(1, Math.ceil(bans.length / pageSize))}</span>
          <button
            onClick={() => setBansPage((p) => (p < Math.ceil(bans.length / pageSize) ? p + 1 : p))}
            disabled={bansPage >= Math.ceil(bans.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setBansPage((p) => Math.max(1, p - 1))}
            disabled={bansPage === 1}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-sm">
            Página {bansPage} de {Math.max(1, Math.ceil(bans.length / pageSize))}
          </span>
          <button
            onClick={() => setBansPage((p) => (p < Math.ceil(bans.length / pageSize) ? p + 1 : p))}
            disabled={bansPage >= Math.ceil(bans.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
      </div>
      )}

      {activeTab === 'appeals' && (
      <div className="mt-8 bg-white/10 border-2 border-yellow-400 rounded-2xl p-4">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Apelaciones</h3>
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Mensaje</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {appeals
                .slice((appealsPage - 1) * pageSize, appealsPage * pageSize)
                .map((a) => {
                const status = String(a.status).toUpperCase();
                const statusClass =
                  status === 'APPROVED'
                    ? 'text-green-400 font-bold'
                    : status === 'REJECTED'
                    ? 'text-red-400 font-bold'
                    : 'text-yellow-300 font-bold';
                const isPending = status === 'PENDING';
                return (
                  <tr key={a.id} className="border-b border-white/20">
                    <td className="p-2">{a.firstName}</td>
                    <td className="p-2">{a.lastName}</td>
                    <td className="p-2">{a.message}</td>
                    <td className={`p-2 ${statusClass}`}>{status}</td>
                    <td className="p-2">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        disabled={busy || !isPending}
                        onClick={() => onApproveAppeal(a.id)}
                        className={`${isPending ? 'bg-green-600 hover:bg-green-800' : 'bg-green-900/50'} text-white font-bold py-1 px-3 rounded`}
                      >
                        {isPending ? 'Aprobar y desbanear' : 'Aprobada'}
                      </button>
                      <button
                        disabled={busy || !isPending}
                        onClick={() => onRejectAppeal(a.id)}
                        className={`${isPending ? 'bg-red-600 hover:bg-red-800' : 'bg-red-900/50'} text-white font-bold py-1 px-3 rounded`}
                      >
                        {isPending ? 'Rechazar' : 'Rechazada'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {appeals.length === 0 && (
                <tr>
                  <td className="p-2 text-center text-gray-200" colSpan={6}>Sin apelaciones</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {appeals
            .slice((appealsPage - 1) * pageSize, appealsPage * pageSize)
            .map((a) => {
              const status = String(a.status).toUpperCase();
              const isPending = status === 'PENDING';
              return (
                <div key={a.id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <div>
                    <div className="text-xs uppercase text-gray-300">Nombre</div>
                    <div className="font-bold truncate">{a.firstName} {a.lastName}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-gray-300">Mensaje</div>
                    <div className="truncate">{a.message}</div>
                  </div>
                  <div className="mt-2 text-xs">{new Date(a.timestamp).toLocaleString()}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      disabled={busy || !isPending}
                      onClick={() => onApproveAppeal(a.id)}
                      className={`${isPending ? 'bg-green-600' : 'bg-green-900/50'} text-white font-bold py-2 px-3 rounded w-full`}
                    >{isPending ? 'Aprobar y desbanear' : 'Aprobada'}</button>
                    <button
                      disabled={busy || !isPending}
                      onClick={() => onRejectAppeal(a.id)}
                      className={`${isPending ? 'bg-red-600' : 'bg-red-900/50'} text-white font-bold py-2 px-3 rounded w-full`}
                    >{isPending ? 'Rechazar' : 'Rechazada'}</button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="md:hidden mt-3 flex items-center justify-between">
          <button
            onClick={() => setAppealsPage((p) => Math.max(1, p - 1))}
            disabled={appealsPage === 1}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-xs">Página {appealsPage} de {Math.max(1, Math.ceil(appeals.length / pageSize))}</span>
          <button
            onClick={() => setAppealsPage((p) => (p < Math.ceil(appeals.length / pageSize) ? p + 1 : p))}
            disabled={appealsPage >= Math.ceil(appeals.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setAppealsPage((p) => Math.max(1, p - 1))}
            disabled={appealsPage === 1}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Anterior</button>
          <span className="text-sm">
            Página {appealsPage} de {Math.max(1, Math.ceil(appeals.length / pageSize))}
          </span>
          <button
            onClick={() => setAppealsPage((p) => (p < Math.ceil(appeals.length / pageSize) ? p + 1 : p))}
            disabled={appealsPage >= Math.ceil(appeals.length / pageSize)}
            className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded disabled:opacity-50"
          >Siguiente</button>
        </div>
      </div>
      )}
    </div>
  );
};
