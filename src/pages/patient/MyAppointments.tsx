import React, { useEffect, useState } from 'react';
import api from '../../services/axiosInstance';
import PatientHeader from '../../components/patient/PatientHeader';

// Define types for appointment and error response
interface Appointment {
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

interface ErrorResponse {
  message: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/patient/pending-appointments');
        console.log(response.data.appointments); // Log the response for debugging
        setAppointments(response.data.appointments);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // if (loading) {
  //   return <p>Loading appointments...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error}</p>;
  // }

  // if (appointments.length === 0) {
  //   return <p>No pending appointments found.</p>;
  // }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <PatientHeader />
      <div className="p-4 pt-24">
        <h2 className="text-xl font-semibold mb-6"> Pending Appointments</h2>
        <ul className="space-y-4">
        {appointments.length > 0 ? (
  appointments.map((appointment) => (
    <li
      key={appointment._id}
      className="p-4 bg-white border rounded-lg shadow-md flex items-center gap-4"
    >
      {/* Doctor's Profile Photo */}
      <img
        src={appointment.doctorId.profilePhoto}
        alt={`${appointment.doctorId.name}'s profile`}
        className="w-24 h-24 rounded-xl object-cover"
      />

      {/* Details in 3 columns */}
      <div className="flex flex-wrap w-full gap-y-2">
        <div className="w-full md:w-1/3">
          <p className="text-xl font-bold mb-2">
            {appointment.doctorId.name}
          </p>
          <p>
            <strong>Email:</strong> {appointment.doctorId.email}
          </p>
        </div>
        <div className="w-full md:w-1/3">
          <p>
            <strong>Specialization:</strong>{' '}
            {appointment.doctorId.specialization}
          </p>
          <p>
            <strong>Date:</strong> {appointment.day}
          </p>
        </div>
        <div className="w-full md:w-1/3">
          {appointment.slots
            .filter((slot) => slot.patientId !== null)
            .map((slot) => (
              <div key={slot._id}>
                <p>
                  <strong>Time Slot:</strong> {slot.start} - {slot.end}
                </p>
                <p>
                  <strong>Status:</strong> {slot.status}
                </p>
              </div>
            ))}
        </div>
      </div>
    </li>
  ))
) : (
  <p className="text-center text-gray-500 mt-4">No appointments</p>
)}

        </ul>
      </div>
    </div>
  );
};

export default MyAppointments;
