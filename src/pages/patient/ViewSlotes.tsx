import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import toast from 'react-hot-toast';

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
    day: string;
    doctorId: string;
    slots: Slot[];
  }

  interface Review {
    patientId: any;
    review: string;
    userPhoto: string;
    userName: string;
    rating: number;
    comment: string;
  }

  const [slots, setSlots] = useState<SlotsResponse[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]); // State for reviews
  const [open, setOpen] = useState(false); // For MUI Dialog
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSlotsAndReviews = async () => {
      try {
        if (doctor && doctor._id) {
          const [slotsResponse, reviewsResponse] = await Promise.all([
            api.get(`/doctor/${doctor._id}/slots`),
            api.get('/doctor/reviews', { params: { doctorId: doctor._id } }),
          ]);
          console.log(reviewsResponse.data);
          
          setSlots(slotsResponse.data);
          setReviews(reviewsResponse.data); // Set reviews data
        }
      } catch (error) {
        console.error('Error fetching slots or reviews:', error);
      }
    };

    fetchSlotsAndReviews();
  }, [doctor]);

  if (!doctor) {
    return <p>No doctor data available.</p>;
  }

  const handleOpenDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedSlotIndex(null);
  };

  const handleConfirmBooking = async () => {
    try {
      if (selectedSlotIndex !== null) {
        const doctorId = doctor._id;
        const amount = 20000; // Set the amount in paise

        // Create a payment session on the backend
        const paymentResponse = await api.post('/patient/payment/create-session', {
          doctorId,
          amount,
          day: slots[0].day,
          slotIndex: selectedSlotIndex,
        });

        const { sessionId } = paymentResponse.data;

        // Load Stripe and redirect to the checkout
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe.js has not loaded properly.');
        }
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Error redirecting to checkout:', error);
          toast.error('Error during payment process. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      toast.error('An error occurred while booking the slot.');
    } finally {
      handleCloseDialog();
    }
  };

  function formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = (hour % 12 || 12).toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
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
                  onClick={() => slot.status !== 'reserved' && handleOpenDialog(index)}
                  key={index}
                  className={`border border-gray-300 rounded-lg p-4 shadow-md min-w-[100px] text-center
                    ${slot.status === 'reserved' ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'hover:cursor-pointer'}`}
                >
                  <p>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slots available.</p>
          )}
        </div>

        {/* User Reviews */}
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">What people say about me:</h3>
          {reviews.length > 0 ? (
            <div>
            {reviews.map((review, index) => (
              <div key={index} className="flex items-center mb-4">
                <img
                  src={review.patientId.profilePhoto || 'https://dummyimage.com/50x50.png/555/fff'}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  {/* Flex container for name and stars */}
                  <div className="flex items-center">
                    <h4 className="font-bold mr-2">{review.patientId.name}</h4>
                    {/* Rating stars */}
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, starIndex) => (
                        <span key={starIndex} className="text-yellow-500">★</span>
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, starIndex) => (
                        <span key={starIndex} className="text-gray-300">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
          
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>

        {/* MUI Dialog for Confirmation */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Slot Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to book this slot?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleConfirmBooking} color="primary" autoFocus>
              Yes, Book it!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ViewSlots;
