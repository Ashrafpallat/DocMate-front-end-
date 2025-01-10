import  { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Table from '../../components/Table';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Doctor } from '../../Interfaces/doctorInterface';
import { getDoctors, updateDoctorStatus } from '../../services/adminService';
import { BarLoader } from 'react-spinners';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors()
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleStatusChange = (doctor: Doctor) => {
    const status = doctor.status === 'Active' ? 'Blocked' : 'Active';
    setSelectedDoctor(doctor);
    setNewStatus(status);
    setDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedDoctor) return;

    try {
      await updateDoctorStatus(selectedDoctor._id, newStatus)
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === selectedDoctor._id ? { ...doctor, status: newStatus } : doctor
        )
      );
    } catch (error) {
      console.error('Error updating doctor status:', error);
    } finally {
      setDialogOpen(false);
      setSelectedDoctor(null);
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
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Location', accessor: 'locationName', sortable: true },
    {
      header: 'Experience',
      accessor: 'experience',
      sortable: true,
      render: (value: number) => `${value} years`,
    },
    { header: 'Specialization', accessor: 'specialization', sortable: true },
    { header: 'Status', accessor: 'status' },
  ];

  const actions = (doctor: Doctor) => (
    <button
      onClick={() => handleStatusChange(doctor)}
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
          // <p>Loading...</p>
          <BarLoader color="#fff"  />

        ) : (
          <Table data={doctors} columns={columns} actions={actions} />
        )}
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title={`Change Status`}
        message={`Are you sure you want to make ${newStatus} this doctor?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setDialogOpen(false)}
      />
    </AdminLayout>
  );
};

export default DoctorManagement;
