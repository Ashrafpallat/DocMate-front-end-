import { Patient } from "./patientInterface";

 interface Slot {
  start: string;
  end: string;
  status: 'issued' | 'reserved' | 'consulted' | 'cancelled';
  patientId?: Patient;
}

export interface DefaultToken {
  _id: string;
  day: string;
  slots: Slot[];
  doctorId: string;
  __v?: number;
}