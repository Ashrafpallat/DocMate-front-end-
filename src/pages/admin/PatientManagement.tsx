import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Table from '../../components/Table';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Patient } from '../../Interfaces/patientInterface';
import { getPatients, updatePatientStatus } from '../../services/adminService';


const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    patientId: '',
    currentStatus: '',
    newStatus: '',
    message: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients()
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleStatusChange = async () => {
    const { patientId, newStatus } = dialogContent;

    try {
      await updatePatientStatus(patientId, newStatus)
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === patientId ? { ...patient, status: newStatus } : patient
        )
      );
    } catch (error) {
      console.error('Error updating patient status:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleOpenConfirmDialog = (patientId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    setDialogContent({
      patientId,
      currentStatus,
      newStatus,
      message: `Are you sure you want to make ${newStatus.toLowerCase()} this patient?`,
    });
    setConfirmDialogOpen(true);
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
      onClick={() => handleOpenConfirmDialog(row._id, row.status)}
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {dialogContent.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
          >
            {dialogContent.newStatus === 'Blocked'? 'Block' : dialogContent.newStatus}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default PatientManagement;
