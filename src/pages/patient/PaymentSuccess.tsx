import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PatientHeader from '../../components/patient/PatientHeader';
import { FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { reserveSlotApi } from '../../services/patientServices';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    const day = searchParams.get('day');
    const slotIndex = parseInt(searchParams.get('slotIndex') || '', 10);

    if (doctorId && day && !isNaN(slotIndex)) {
      // Function to reserve the slot after payment success
      const reserveSlot = async () => {
        try {
          // const response = await api.post('/patient/book-slot', {doctorId,day,slotIndex,});
          const response = await reserveSlotApi(doctorId,day,slotIndex)
          if (response?.data) {
            toast.success('Slot booked successfully!');
            // Additional UI updates if needed
          }
        } catch (error) {
          console.error('Error booking slot:', error);
          toast.error('An error occurred while booking the slot.');
        }
      };

      // Call the function to reserve the slot
      reserveSlot();
    } else {
      toast.error('Invalid booking details.');
    }
  }, [searchParams]);
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/patient/appointments'); // Navigate to the home page
  };
  return (
    <div>
      <PatientHeader />
      <div className="flex flex-col items-center justify-center h-screen bg-[#FAF9F6] text-center">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
          <p className="text-gray-600 mb-1">Your payment has been processed, and your slot is being reserved.</p>
          <p className="text-gray-600">Thank you for booking with us!</p>
          <button 
          onClick={handleReturnHome} 
          className="mt-4 px-4 py-2 rounded-md bg-secondary hover:bg-[#8F8F8F]  text-black transition duration-200"
        >
          See appointments
        </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
