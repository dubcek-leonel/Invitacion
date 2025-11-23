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
        <div className="overflow-x-auto">
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
              {attendees.map((a) => {
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
      </div>
      )}

      

      {activeTab === 'bans' && (
      <div className="bg-white/10 border-2 border-yellow-400 rounded-2xl p-4">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Listado de baneos</h3>
        <div className="overflow-x-auto">
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
              {bans.map((b) => (
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
      </div>
      )}

      {activeTab === 'appeals' && (
      <div className="mt-8 bg-white/10 border-2 border-yellow-400 rounded-2xl p-4">
        <h3 className="text-xl font-bold text-yellow-300 mb-4">Apelaciones</h3>
        <div className="overflow-x-auto">
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
              {appeals.map((a) => {
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
      </div>
      )}
    </div>
  );
};
