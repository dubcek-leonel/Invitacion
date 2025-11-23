export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  cycle: string;
  career: string;
  contribution: string; // What they are bringing
  timestamp: number;
}

export enum AppState {
  FORM = 'FORM',
  SUCCESS = 'SUCCESS',
  BANNED = 'BANNED',
}