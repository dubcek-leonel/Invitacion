import { Attendee, Ban, Appeal, AppealStatus } from "../types";
import { supabase } from "./supabase.ts";

const SUPABASE_ENABLED = !!supabase;

const DB_KEY = "remoja_biscocho_db";
const BAN_KEY = "banned_user_ip_simulation";
const BANS_KEY = "bans_db";
const APPEALS_KEY = "appeals_db";
const CURRENT_USER_KEY = "current_user_identity";
const ARCHIVE_KEY = "attendees_archive";

// Simulate saving to a database
export const saveAttendee = async (
  attendee: Omit<Attendee, "id" | "timestamp">
): Promise<void> => {
  const currentData = getAttendees();
  const newAttendee: Attendee = {
    ...attendee,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };

  currentData.push(newAttendee);
  localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({
      firstName: newAttendee.firstName,
      lastName: newAttendee.lastName,
    })
  );

  if (SUPABASE_ENABLED) {
    const { error } = await supabase.from("attendees").insert({
      firstName: newAttendee.firstName,
      lastName: newAttendee.lastName,
      cycle: newAttendee.cycle,
      career: newAttendee.career,
      contribution: newAttendee.contribution,
      timestamp: newAttendee.timestamp,
    });
    if (error) {
      console.error("Supabase insert failed", error);
    }
  }
};

export const getAttendees = (): Attendee[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const getAttendeesAsync = async (): Promise<Attendee[]> => {
  const bans = await listBans();
  const isBanned = (a: Attendee) =>
    bans.some(
      (b) =>
        b.firstName.toLowerCase() === a.firstName.toLowerCase() &&
        b.lastName.toLowerCase() === a.lastName.toLowerCase()
    );

  if (SUPABASE_ENABLED) {
    try {
      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = (data as any[]).map((d) => ({
          id: String(d.id),
          firstName: d.firstName,
          lastName: d.lastName,
          cycle: d.cycle,
          career: d.career,
          contribution: d.contribution,
          timestamp: d.timestamp,
        })) as Attendee[];
        return mapped.filter((a) => !isBanned(a));
      }
    } catch (e) {
      console.error("Supabase select failed", e);
    }
  }
  return getAttendees()
    .reverse()
    .filter((a) => !isBanned(a));
};

export const removeAttendee = async (id: string): Promise<void> => {
  if (SUPABASE_ENABLED) {
    const { error } = await supabase.from("attendees").delete().eq("id", id);
    if (error) {
      const list = getAttendees();
      const next = list.filter((a) => a.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return;
    }
  } else {
    const list = getAttendees();
    const next = list.filter((a) => a.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(next));
  }
};

export const archiveAttendee = (attendee: Attendee): void => {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  const list: Attendee[] = raw ? JSON.parse(raw) : [];
  const exists = list.some(
    (x) =>
      x.firstName.toLowerCase() === attendee.firstName.toLowerCase() &&
      x.lastName.toLowerCase() === attendee.lastName.toLowerCase()
  );
  const next = exists
    ? list.map((x) =>
        x.firstName.toLowerCase() === attendee.firstName.toLowerCase() &&
        x.lastName.toLowerCase() === attendee.lastName.toLowerCase()
          ? attendee
          : x
      )
    : [...list, attendee];
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next));
};

export const getArchivedByName = (
  firstName: string,
  lastName: string
): Attendee | null => {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  const list: Attendee[] = raw ? JSON.parse(raw) : [];
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  const found = list.find(
    (x) => x.firstName.toLowerCase() === f && x.lastName.toLowerCase() === l
  );
  return found ?? null;
};

export const removeArchivedByName = (
  firstName: string,
  lastName: string
): void => {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  const list: Attendee[] = raw ? JSON.parse(raw) : [];
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  const next = list.filter(
    (x) => x.firstName.toLowerCase() !== f || x.lastName.toLowerCase() !== l
  );
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next));
};

// Simulate IP Block
export const banUser = (): void => {
  localStorage.setItem(BAN_KEY, "true");
};

export const isUserBanned = (): boolean => {
  return localStorage.getItem(BAN_KEY) === "true";
};

export const unbanUser = (): void => {
  localStorage.removeItem(BAN_KEY);
};

export const getCurrentUser = (): {
  firstName: string;
  lastName: string;
} | null => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { firstName: string; lastName: string };
    if (
      parsed &&
      typeof parsed.firstName === "string" &&
      typeof parsed.lastName === "string"
    ) {
      return parsed;
    }
  } catch {}
  return null;
};

export const setCurrentUser = (firstName: string, lastName: string): void => {
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() })
  );
};

export const listBans = async (): Promise<Ban[]> => {
  if (SUPABASE_ENABLED) {
    try {
      const { data, error } = await supabase
        .from("bans")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as any[]).map((d) => ({
          id: String(d.id),
          firstName: d.firstName,
          lastName: d.lastName,
          reason: d.reason,
          timestamp: d.timestamp,
        })) as Ban[];
      }
    } catch {}
  }
  const raw = localStorage.getItem(BANS_KEY);
  return raw ? (JSON.parse(raw) as Ban[]) : [];
};

export const addBan = async (
  ban: Omit<Ban, "id" | "timestamp">
): Promise<void> => {
  const item: Ban = {
    ...ban,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };
  if (SUPABASE_ENABLED) {
    const { error } = await supabase.from("bans").insert({
      firstName: item.firstName,
      lastName: item.lastName,
      reason: item.reason,
      timestamp: item.timestamp,
    });
    if (error) {
      const list = await listBans();
      list.unshift(item);
      localStorage.setItem(BANS_KEY, JSON.stringify(list));
      return;
    }
  } else {
    const list = await listBans();
    list.unshift(item);
    localStorage.setItem(BANS_KEY, JSON.stringify(list));
  }
};

export const removeBan = async (id: string): Promise<void> => {
  if (SUPABASE_ENABLED) {
    const { error } = await supabase.from("bans").delete().eq("id", id);
    const list = await listBans();
    const next = list.filter((b) => b.id !== id);
    localStorage.setItem(BANS_KEY, JSON.stringify(next));
    if (error) return;
  } else {
    const list = await listBans();
    const next = list.filter((b) => b.id !== id);
    localStorage.setItem(BANS_KEY, JSON.stringify(next));
  }
};

export const removeBanByName = async (
  firstName: string,
  lastName: string
): Promise<void> => {
  if (SUPABASE_ENABLED) {
    const { error } = await supabase
      .from("bans")
      .delete()
      .eq("firstName", firstName)
      .eq("lastName", lastName);
    const list = await listBans();
    const next = list.filter(
      (b) =>
        b.firstName.toLowerCase() !== firstName.toLowerCase() ||
        b.lastName.toLowerCase() !== lastName.toLowerCase()
    );
    localStorage.setItem(BANS_KEY, JSON.stringify(next));
    if (error) return;
  } else {
    const list = await listBans();
    const next = list.filter(
      (b) =>
        b.firstName.toLowerCase() !== firstName.toLowerCase() ||
        b.lastName.toLowerCase() !== lastName.toLowerCase()
    );
    localStorage.setItem(BANS_KEY, JSON.stringify(next));
  }
};

export const isNameBanned = async (
  firstName: string,
  lastName: string
): Promise<boolean> => {
  const list = await listBans();
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  return list.some(
    (b) => b.firstName.toLowerCase() === f && b.lastName.toLowerCase() === l
  );
};

// removed hashPassword helper

// removed user auth helpers (login/register) per request

export const listAppeals = async (): Promise<Appeal[]> => {
  if (SUPABASE_ENABLED) {
    try {
      const { data, error } = await supabase
        .from("appeals")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as any[]).map((d) => ({
          id: String(d.id),
          firstName: d.firstName,
          lastName: d.lastName,
          message: d.message,
          status: d.status as AppealStatus,
          timestamp: d.timestamp,
        })) as Appeal[];
      }
    } catch {}
  }
  const raw = localStorage.getItem(APPEALS_KEY);
  return raw ? (JSON.parse(raw) as Appeal[]) : [];
};

export const addAppeal = async (
  appeal: Omit<Appeal, "id" | "timestamp" | "status">
): Promise<void> => {
  const item: Appeal = {
    ...appeal,
    id: Math.random().toString(36).substring(7),
    status: "PENDING",
    timestamp: Date.now(),
  };
  if (SUPABASE_ENABLED) {
    const { error } = await supabase.from("appeals").insert({
      firstName: item.firstName,
      lastName: item.lastName,
      message: item.message,
      status: item.status,
      timestamp: item.timestamp,
    });
    if (error) {
      const list = await listAppeals();
      list.unshift(item);
      localStorage.setItem(APPEALS_KEY, JSON.stringify(list));
      return;
    }
  } else {
    const list = await listAppeals();
    list.unshift(item);
    localStorage.setItem(APPEALS_KEY, JSON.stringify(list));
  }
};

export const updateAppealStatus = async (
  id: string,
  status: AppealStatus
): Promise<void> => {
  if (SUPABASE_ENABLED) {
    const { error } = await supabase
      .from("appeals")
      .update({ status })
      .eq("id", id);
    if (error) {
      const list = await listAppeals();
      const next = list.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem(APPEALS_KEY, JSON.stringify(next));
      return;
    }
  } else {
    const list = await listAppeals();
    const next = list.map((a) => (a.id === id ? { ...a, status } : a));
    localStorage.setItem(APPEALS_KEY, JSON.stringify(next));
  }
};
