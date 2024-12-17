import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { changeKycStatus } from '../../redux/doctorSlice';
import ConfirmationDialog from '../../components/ConfirmationDialog';

interface DoctorVerification {
  _id: string;
  name: string;
  regNo: string;
  yearOfReg: string;
  medicalCouncil: string;
  proofFile: string;
  doctorId: string;
}

const AdminVerify = () => {
  const dispatch = useDispatch();
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerification[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Fetch pending verifications on component mount
  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/pending-verifications');
        setPendingDoctors(response.data);
      } catch (error) {
        console.error('Error fetching pending verifications:', error);
      }
    };

    fetchPendingDoctors();
  }, []);

  const handleApprove = async () => {
    if (!selectedDoctorId) return;

    try {
      await axios.post(`http://localhost:5000/api/admin/pending-verifications/${selectedDoctorId}`);
      setPendingDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.doctorId !== selectedDoctorId)
      );

      toast.success('Doctor approved successfully!');
      dispatch(changeKycStatus({ kycVerified: true }));
    } catch (error) {
      console.error('Error approving doctor:', error);
      toast.error('Failed to approve the doctor');
    } finally {
      setOpenDialog(false);
      setSelectedDoctorId(null);
    }
  };

  const openConfirmationDialog = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setOpenDialog(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Pending Doctor Verifications</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Reg No</th>
              <th className="px-6 py-3 border-b">Year of Registration</th>
              <th className="px-6 py-3 border-b">Medical Council</th>
              <th className="px-6 py-3 border-b">Proof</th>
              <th className="px-6 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="px-6 py-3 border-b">{doctor.name}</td>
                  <td className="px-6 py-3 border-b">{doctor.regNo}</td>
                  <td className="px-6 py-3 border-b">{doctor.yearOfReg}</td>
                  <td className="px-6 py-3 border-b">{doctor.medicalCouncil}</td>
                  <td className="px-6 py-3 border-b">
                    <a
                      href={doctor.proofFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Proof
                    </a>
                  </td>
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={() => openConfirmationDialog(doctor.doctorId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No pending verifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openDialog}
        title="Approve Doctor"
        message="Are you sure you want to approve this doctor?"
        onConfirm={handleApprove}
        onCancel={() => setOpenDialog(false)}
        confirmButtonText="Approve"
        cancelButtonText="Cancel"
      />
    </AdminLayout>
  );
};

export default AdminVerify;
