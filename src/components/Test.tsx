import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/axiosInstance';
import PatientHeader from './patient/PatientHeader';

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
          const response = await api.post('/patient/book-slot', {
            doctorId,
            day,
            slotIndex,
          });

          if (response.data) {
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

  return (
    <div>
      <PatientHeader/>
      Payment Successful
    </div>
  );
};

export default PaymentSuccess;
