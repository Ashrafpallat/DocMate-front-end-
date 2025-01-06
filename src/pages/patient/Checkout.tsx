import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import { loadStripe } from '@stripe/stripe-js';
import {
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import toast from 'react-hot-toast';
import { createPaymentSession } from '../../services/patientServices';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor, slot, consultationFee, day, selectedSlotIndex } = location.state || {};
    console.log('location.state', location.state);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!doctor || !slot) {
            toast('Missing booking details.',{icon: '☹️'});
            navigate('/patient/view-slotes');
        }
    }, [doctor, slot, navigate]);

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Create a payment session
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe.js has not loaded properly.');
            }

            if (!consultationFee) {
                toast.error('Consultation fee is missing');
                return;
              }
              
              if (!doctor._id) {
                toast.error('Doctor details are missing');
                return;
              }
              
              if (!day) {
                toast.error('Day is missing');
                return;
              }
              
              if (selectedSlotIndex === null || selectedSlotIndex === undefined) {
                toast.error('Selected slot is missing');
                return;
              }
              

            const amount = consultationFee * 100; // Convert to paise
            const paymentResponse = await createPaymentSession(
                doctor._id,
                amount,
                day,
                selectedSlotIndex
            );


            const { sessionId } = paymentResponse?.data;

            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Error during payment process:', error);
                toast.error('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error creating payment session:', error);
            toast.error('An error occurred during the payment process.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PatientHeader />
            <div className="p-6 bg-[#FAF9F6] min-h-screen pt-24 flex justify-center items-center">
                <Card className="w-full max-w-md">
                    <CardContent>
                        <Typography variant="h5" component="div" className="font-bold mb-4">
                            Confirm Your Booking
                        </Typography>
                        <div className="mb-4">
                            <Typography variant="body1" className="font-medium">
                                Doctor:
                            </Typography>
                            <Typography>{doctor.name}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body1" className="font-medium">
                                Specialization:
                            </Typography>
                            <Typography>{doctor.specialization}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body1" className="font-medium">
                                Appointment Date:
                            </Typography>
                            <Typography>{day}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body1" className="font-medium">
                                Slot Timing:
                            </Typography>
                            <Typography>
                                {slot.start} - {slot.end}
                            </Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="body1" className="font-medium">
                                Consultation Fee:
                            </Typography>
                            <Typography>₹{consultationFee}</Typography>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Checkout;
