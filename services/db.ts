import { Attendee } from '../types';

const DB_KEY = 'remoja_biscocho_db';
const BAN_KEY = 'banned_user_ip_simulation';

// Simulate saving to a database
export const saveAttendee = (attendee: Omit<Attendee, 'id' | 'timestamp'>): void => {
  const currentData = getAttendees();
  const newAttendee: Attendee = {
    ...attendee,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };
  
  currentData.push(newAttendee);
  localStorage.setItem(DB_KEY, JSON.stringify(currentData));
};

export const getAttendees = (): Attendee[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

// Simulate IP Block
export const banUser = (): void => {
  localStorage.setItem(BAN_KEY, 'true');
};

export const isUserBanned = (): boolean => {
  return localStorage.getItem(BAN_KEY) === 'true';
};