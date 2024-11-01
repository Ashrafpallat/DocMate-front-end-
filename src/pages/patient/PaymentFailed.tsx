import React from 'react';
import { toast } from 'react-toastify';

const PaymentFailed: React.FC = () => {
  // Display a toast notification on page load
  React.useEffect(() => {
    toast.error('Payment failed. Please try again or contact support.');
  }, []);

  return (
    <div className="payment-failed">
      <h2>Payment Failed</h2>
      <p>We were unable to process your payment. Please try again later.</p>
      <p>If you continue to experience issues, contact our support team.</p>
    </div>
  );
};

export default PaymentFailed;
