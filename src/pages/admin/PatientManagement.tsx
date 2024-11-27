import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/axiosInstance';
import Swal from 'sweetalert2';

interface Patient {
  _id: string;
  name: string;
  email: string;
  location: string;
  age: number;
  status: string;
  profilePhoto: string;
}

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<Patient[]>('/admin/patients');
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleStatusChange = async (patientId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
  
    try {
      // Show SweetAlert confirmation
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You are about to ${newStatus.toLowerCase()} this patient.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${newStatus}!`,
      });
  
      if (result.isConfirmed) {
        // Proceed with the status change
        await api.put(`/admin/patient/${patientId}/status`, { status: newStatus });
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === patientId ? { ...patient, status: newStatus } : patient
          )
        );
  
        // Show success alert
        Swal.fire(
          'Success!',
          `The patient has been ${newStatus.toLowerCase()} successfully.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
  
      // Show error alert
      Swal.fire(
        'Error!',
        'An error occurred while updating the status. Please try again.',
        'error'
      );
    }
  };
  

  // if (loading) return <div>Loading...</div>;

  return (
    <AdminLayout>
  <div className="p-4">
    <h2 className="text-2xl font-semibold">Patient Management</h2>
    <table className="min-w-full mt-4 border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 text-center border border-gray-300">Profile</th>
          <th className="py-2 px-4 text-center border border-gray-300">Name</th>
          <th className="py-2 px-4 text-center border border-gray-300">Email</th>
          <th className="py-2 px-4 text-center border border-gray-300">Location</th>
          <th className="py-2 px-4 text-center border border-gray-300">Age</th>
          <th className="py-2 px-4 text-center border border-gray-300">Status</th>
          <th className="py-2 px-4 text-center border border-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient._id}>
            <td className="py-2 px-4 text-center border border-gray-300">
              <img
                src={patient.profilePhoto || `https://dummyimage.com/300.png/555/fff&text=+${patient.name}`}
                alt={patient.name}
                className="w-12 h-12 rounded-full mx-auto"
              />
            </td>
            <td className="py-2 px-4 text-center border border-gray-300">{patient.name || 'N/A'}</td>
            <td className="py-2 px-4 text-center border border-gray-300">{patient.email || 'N/A'}</td>
            <td className="py-2 px-4 text-center border border-gray-300">{patient.location || 'N/A'}</td>
            <td className="py-2 px-4 text-center border border-gray-300">{patient.age || 'N/A'}</td>
            <td className="py-2 px-4 text-center border border-gray-300">{patient.status || 'N/A'}</td>
            <td className="py-2 px-4 text-center border border-gray-300">
              <button
                onClick={() => handleStatusChange(patient._id, patient.status)}
                className={`py-1 px-4 ${
                  patient.status === 'Active' ? 'bg-red-500' : 'bg-green-500'
                } text-white rounded`}
              >
                {patient.status === 'Active' ? 'Block' : 'Unblock'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</AdminLayout>

  );
};

export default PatientManagement;
