import { Patient } from "./patientInterface";

export default interface Prescription {
    patientId: Patient;
    diagnosis: string;
    symptoms: string;
    medications: string;
    date: string;
    _id: string;
}
