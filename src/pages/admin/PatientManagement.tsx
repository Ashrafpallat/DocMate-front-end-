import React, { useEffect, useState } from 'react';
import api from '../../services/axiosInstance';
import AdminLayout from '../../components/admin/AdminLayout';
import Table from '../../components/Table';
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
        await api.put(`/admin/patient/${patientId}/status`, { status: newStatus });
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === patientId ? { ...patient, status: newStatus } : patient
          )
        );
        Swal.fire(
          'Success!',
          `The patient has been ${newStatus.toLowerCase()} successfully.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
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
      render: (value: string, row: Patient) => (
        <img
          src={value || `https://dummyimage.com/300.png/555/fff&text=+${row.name}`}
          alt={row.name}
          className="w-12 h-12 rounded-full mx-auto"
        />
      ),
    },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Location', accessor: 'location', sortable: true },
    { header: 'Age', accessor: 'age', sortable: true },
    { header: 'Status', accessor: 'status', sortable: false },
  ];

  const actions = (row: Patient) => (
    <button
      onClick={() => handleStatusChange(row._id, row.status)}
      className={`py-1 px-4 ${row.status === 'Active' ? 'bg-red-500' : 'bg-green-500'
        } text-white rounded`}
    >
      {row.status === 'Active' ? 'Block' : 'Unblock'}
    </button>
  );


  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Patient Management</h2>
        <div className="mt-4">
          <Table data={patients} columns={columns} actions={actions} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientManagement;
