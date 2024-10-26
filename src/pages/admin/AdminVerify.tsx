import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';
import Swal, { SweetAlertResult } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; // Optional, for React integration
import { useDispatch } from 'react-redux';
import { changeKycStatus } from '../../redux/doctorSlice';


interface DoctorVerification {
  _id: string;
  name: string;
  regNo: string;
  yearOfReg: string;  
  medicalCouncil: string;
  proofFile: string;
  doctorId: string
}

const AdminVerify = () => {
  const dispatch = useDispatch()
  const [pendingDoctors, setPendingDoctors] = useState<DoctorVerification[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  // Fetch pending verifications on component mount
  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/pending-verifications');
        
        setPendingDoctors(response.data);
      } catch (error) {
        console.error('Error fetching pending verifications:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id: String) => {
    const MySwal = withReactContent(Swal);
  
    MySwal.fire({
      title: 'Are you sure?',
      text: "You are about to approve this doctor.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`http://localhost:5000/api/admin/pending-verifications/${id}`);
          // Remove the approved doctor from the list
          setPendingDoctors(pendingDoctors.filter((doctor) => doctor.doctorId !== id));

          toast.success('Doctor approved successfully!');
          dispatch(changeKycStatus({kycVerified: true}))
          MySwal.fire('Approved!', 'The doctor has been approved.', 'success');
        } catch (error) {
          console.error('Error approving doctor:', error);
          toast.error('Failed to approve the doctor');
        }
      } else {
        // Handle if the user cancels
        console.log("Doctor approval canceled");
      }
    });
  };
  

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
                    <a href={doctor.proofFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View Proof
                    </a>
                  </td>
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={() => handleApprove(doctor.doctorId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">No pending verifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminVerify;
