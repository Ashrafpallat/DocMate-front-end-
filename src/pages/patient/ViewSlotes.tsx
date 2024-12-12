import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const ViewSlots = () => {
  const location = useLocation();
  const { doctor } = location.state || {}; // Access the passed doctor data
  interface Slot {
    status: string;
    start: string;
    end: string;
  }

  interface SlotsResponse {
    // id: string,
    day: string;
    doctorId: string;
    slots: Slot[];
  }

  const [slots, setSlots] = useState<SlotsResponse[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (doctor && doctor._id) {
          const response = await api.get(`/doctor/${doctor._id}/slots`);
          const slotsFromResponse = response.data;
          console.log(slotsFromResponse);

          setSlots(slotsFromResponse);
          console.log('slotes',slots);
          
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();

  }, [doctor]); 

  if (!doctor) {
    return <p>No doctor data available.</p>;
  }

  const handleSlotClick = async (index: number) => {
    try {
      const doctorId = doctor._id;
  
      const { isConfirmed } = await Swal.fire({
        title: 'Confirm Slot Booking',
        text: 'Are you sure you want to book this slot?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, book it!',
      });
  
      if (isConfirmed) {

        const amount = 20000; // Set the amount in paise

        // Create a payment session on the backend
        const paymentResponse = await api.post('/patient/payment/create-session', {doctorId, amount,day: slots[0].day, slotIndex: index })
    
        const { sessionId } = paymentResponse.data;
    
        // Load Stripe and redirect to the checkout
        const stripe = await stripePromise;
        if(!stripe){
          throw new Error('Stripe.js has not loaded properly.');
        }
        const { error } = await stripe.redirectToCheckout({ sessionId });
    
        if (error) {
          console.error('Error redirecting to checkout:', error);
          alert('Error during payment process. Please try again.');
        }
        
        // const response = await api.post('/patient/book-slot', {
        //   doctorId,  
        //   day: slots[0].day,  
        //   slotIndex: index,    
        // });
  
        // if (response.data) {
        //   toast.success('Slot booked successfully!');
        //   // Update UI or refresh the slot data here if needed
        // }
      } else {
        toast.info('Slot booking canceled.');
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('An error occurred while booking the slot.');
    }
  };
  function formatTime(time: string): string {
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format and pad with zero if needed
    const formattedMinute = minute.toString().padStart(2, "0"); // Ensure two digits for minute
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  }

  return (
    <>
      <PatientHeader />
      <div className="p-6 bg-[#FAF9F6] min-h-screen pt-24">
        {/* Doctor Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex">
            <img
              src={doctor.profilePhoto || `https://dummyimage.com/300.png/555/fff&text=+${doctor.name}`}
              alt={doctor.name}
              className="w-24 h-24 rounded-3xl object-cover mr-6"
            />
            <div>
              <h3 className="text-2xl font-bold">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">Experience: {doctor.experience} years</p>
              <p className="text-gray-500">Location: {doctor.locationName}</p>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Available Slots</h3>
          {slots.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {slots[0].slots.map((slot, index) => (
                <div
                  onClick={() => slot.status !== 'reserved' && handleSlotClick(index)}
                  key={index}
                  className={`border border-gray-300 rounded-lg p-4 shadow-md min-w-[100px] text-center 
                    ${slot.status === 'reserved' ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'hover:cursor-pointer'}`}
                  style={{ pointerEvents: slot.status === 'reserved' ? 'none' : 'auto' }}
                >
                  <p>{formatTime(slot.start)} - {formatTime(slot.end)}</p>
                  {/* {slot.status === 'reserved' && <p className="text-xs text-red-500">Reserved</p>} */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slots available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewSlots;
