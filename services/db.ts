import { Attendee } from "../types";
import { supabase } from "./supabase";

const SUPABASE_ENABLED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const DB_KEY = "remoja_biscocho_db";
const BAN_KEY = "banned_user_ip_simulation";

// Simulate saving to a database
export const saveAttendee = (
  attendee: Omit<Attendee, "id" | "timestamp">
): void => {
  const currentData = getAttendees();
  const newAttendee: Attendee = {
    ...attendee,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };

  currentData.push(newAttendee);
  localStorage.setItem(DB_KEY, JSON.stringify(currentData));

  if (SUPABASE_ENABLED) {
    (async () => {
      await supabase.from("attendees").insert({
        id: newAttendee.id,
        firstName: newAttendee.firstName,
        lastName: newAttendee.lastName,
        cycle: newAttendee.cycle,
        career: newAttendee.career,
        contribution: newAttendee.contribution,
        timestamp: newAttendee.timestamp,
      });
    })();
  }
};

export const getAttendees = (): Attendee[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const getAttendeesAsync = async (): Promise<Attendee[]> => {
  if (SUPABASE_ENABLED) {
    try {
      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      if (data) return data as Attendee[];
    } catch (_) {}
  }
  return getAttendees().reverse();
};

// Simulate IP Block
export const banUser = (): void => {
  localStorage.setItem(BAN_KEY, "true");
};

export const isUserBanned = (): boolean => {
  return localStorage.getItem(BAN_KEY) === "true";
};
