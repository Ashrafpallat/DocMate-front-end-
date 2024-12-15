// patient.interface.ts

export interface Patient {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: string;
  status: 'Active' | 'Blocked';
  profilePhoto: string,
  password: string;
  createdAt: Date;
  updatedAt: Date;

}
