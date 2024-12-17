import { Patient } from "./patientInterface";

export interface Review {
    _id: string;
    patientId: Patient;
    rating: number;
    review: string;
    createdAt: string;
}