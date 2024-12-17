import { Doctor } from "./doctorInterface";
import { Patient } from "./patientInterface";

export default interface Prescription {
    patientId: Patient;
    doctorId: Doctor
    diagnosis: string;
    symptoms: string;
    medications: string;
    date?: string;
    _id?: string;
}
