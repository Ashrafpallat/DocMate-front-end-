import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/axiosInstance';
import Swal from 'sweetalert2';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  locationName: string;
  experience: number;
  specialization: string;
  status: string;
  profilePhoto: string;
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get<Doctor[]>('/admin/doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleStatusChange = async (doctorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';

    try {
      // Show SweetAlert confirmation
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You are about to ${newStatus} this doctor.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${newStatus}!`,
      });

      if (result.isConfirmed) {
        // Update the doctor's status
        await api.put(`/admin/doctors/${doctorId}/status`, { status: newStatus });
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === doctorId ? { ...doctor, status: newStatus } : doctor
          )
        );

        // Show success alert
        Swal.fire(
          'Success!',
          `The doctor has been ${newStatus} successfully.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);

      // Show error alert
      Swal.fire(
        'Error!',
        'An error occurred while updating the status. Please try again.',
        'error'
      );
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Doctor Management</h2>
        <table className="min-w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center border border-gray-300">Profile</th>
              <th className="py-2 px-4 text-center border border-gray-300">Name</th>
              <th className="py-2 px-4 text-center border border-gray-300">Email</th>
              <th className="py-2 px-4 text-center border border-gray-300">Location</th>
              <th className="py-2 px-4 text-center border border-gray-300">Experience</th>
              <th className="py-2 px-4 text-center border border-gray-300">Specialization</th>
              <th className="py-2 px-4 text-center border border-gray-300">Status</th>
              <th className="py-2 px-4 text-center border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="py-2 px-4 text-center border border-gray-300">
                  <img
                    src={
                      doctor.profilePhoto ||
                      `https://dummyimage.com/300.png/555/fff&text=${doctor.name}`
                    }
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.name || 'N/A'}</td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.email || 'N/A'}</td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.locationName || 'N/A'}</td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.experience || 'N/A'} years</td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.specialization || 'N/A'}</td>
                <td className="py-2 px-4 text-center border border-gray-300">{doctor.status || 'N/A'}</td>
                <td className="py-2 px-4 text-center border border-gray-300">
                  <button
                    onClick={() => handleStatusChange(doctor._id, doctor.status)}
                    className={`py-1 px-4 ${
                      doctor.status === 'Active' ? 'bg-red-500' : 'bg-green-500'
                    } text-white rounded`}
                  >
                    {doctor.status === 'Active' ? 'Block' : 'Unblock'}
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

export default DoctorManagement;
