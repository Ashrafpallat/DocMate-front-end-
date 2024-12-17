export interface Appointment {
    doctorId: {
      _id: string;
      profilePhoto: string;
      name: string;
      email: string;
      specialization: string;
    };
    _id: string;
    day: string;
    slots: Array<{
      _id: string;
      start: string;
      end: string;
      status: string;
      patientId: string | null; // If patientId is null, the slot is not booked
    }>;
  }