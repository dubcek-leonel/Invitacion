export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  cycle: string;
  career: string;
  contribution: string; // What they are bringing
  timestamp: number;
}

export type AppealStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Appeal {
  id: string;
  firstName: string;
  lastName: string;
  message: string;
  status: AppealStatus;
  timestamp: number;
}

export interface Ban {
  id: string;
  firstName: string;
  lastName: string;
  reason: string;
  timestamp: number;
}

export enum AppState {
  FORM = "FORM",
  SUCCESS = "SUCCESS",
  BANNED = "BANNED",
}
