import React, { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';

interface Prescription {
  _id: string;
  doctorId: {
    _id: string;
    profilePhoto: string;
    name: string;
    email: string;
    specialization: string;
  };
  diagnosis: string;
  date: string;
}

const History: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/patient/history');
        console.log(response.data); // Debug response
        setPrescriptions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <PatientHeader />
      <div className="p-4 pt-24">
        <h2 className="text-xl font-semibold mb-6">Consultation History</h2>
        {loading && <p>Loading consultation history...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && prescriptions.length === 0 && (
          <p>No consultation history found.</p>
        )}
        <ul className="space-y-4">
          {prescriptions.map((prescription) => (
            <li
              key={prescription._id}
              className="p-4 bg-white border rounded-lg shadow-md flex items-center gap-4"
            >
              {/* Doctor's Profile Photo */}
              <img
                src={prescription.doctorId.profilePhoto}
                alt={`${prescription.doctorId.name}'s profile`}
                className="w-24 h-24 rounded-xl object-cover"
              />

              {/* Details in 2 or 3 columns */}
              <div className="flex flex-wrap w-full gap-y-2">
                <div className="w-full md:w-1/3">
                  <p className="text-xl font-bold mb-2">
                    {prescription.doctorId.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {prescription.doctorId.email}
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <p>
                    <strong>Specialization:</strong>{' '}
                    {prescription.doctorId.specialization}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <p>
                    <strong>Diagnosis:</strong> {prescription.diagnosis}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
