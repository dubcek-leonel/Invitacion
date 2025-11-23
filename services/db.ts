import { Attendee } from "../types";
import { supabase } from "./supabase.ts";

const SUPABASE_ENABLED = !!supabase;

const DB_KEY = "remoja_biscocho_db";
const BAN_KEY = "banned_user_ip_simulation";

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
  if (SUPABASE_ENABLED) {
    try {
      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return (data as any[]).map((d) => ({
          id: String(d.id),
          firstName: d.firstName,
          lastName: d.lastName,
          cycle: d.cycle,
          career: d.career,
          contribution: d.contribution,
          timestamp: d.timestamp,
        })) as Attendee[];
      }
    } catch (e) {
      console.error("Supabase select failed", e);
    }
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
