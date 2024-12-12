import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/axiosInstance';
import Swal from 'sweetalert2';
import Table from '../../components/Table';

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
        await api.put(`/admin/doctors/${doctorId}/status`, { status: newStatus });
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === doctorId ? { ...doctor, status: newStatus } : doctor
          )
        );

        Swal.fire(
          'Success!',
          `The doctor has been ${newStatus} successfully.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
      Swal.fire(
        'Error!',
        'An error occurred while updating the status. Please try again.',
        'error'
      );
    }
  };

  const columns = [
    {
      header: 'Profile',
      accessor: 'profilePhoto',
      render: (value: string, row: Doctor) => (
        <img
          src={value || `https://dummyimage.com/300.png/555/fff&text=${row.name}`}
          alt={row.name}
          className="w-12 h-12 rounded-full mx-auto"
        />
      ),
    },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email',sortable: true },
    { header: 'Location', accessor: 'locationName',sortable: true },
    { header: 'Experience', accessor: 'experience',sortable: true, render: (value: number) => `${value} years` },
    { header: 'Specialization', accessor: 'specialization',sortable: true },
    { header: 'Status', accessor: 'status' },
  ];

  const actions = (doctor: Doctor) => (
    <button
      onClick={() => handleStatusChange(doctor._id, doctor.status)}
      className={`py-1 px-4 ${
        doctor.status === 'Active' ? 'bg-red-500' : 'bg-green-500'
      } text-white rounded`}
    >
      {doctor.status === 'Active' ? 'Block' : 'Unblock'}
    </button>
  );

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Doctor Management</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table data={doctors} columns={columns} actions={actions} />
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;
