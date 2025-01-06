import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import PatientHeader from '../../components/patient/PatientHeader';
import toast from 'react-hot-toast';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  // Display a toast notification on page load
  React.useEffect(() => {
    toast('Payment failed. Please try again or contact support.',{icon:'☹️'});
  }, []);

  const handleGoBack = () => {
    navigate(-2); 
  };

  return (
    <div>
      <PatientHeader/>
    <div className="flex flex-col items-center justify-center h-screen bg-[#FAF9F6] text-center">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
        <FaTimesCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-1">We were unable to process your payment. Please try again later.</p>
        <p className="text-gray-600 mb-4">If you continue to experience issues, contact our support team.</p>
        <button 
          onClick={handleGoBack} 
          className="mt-4 px-4 py-2 bg-secondary hover:bg-[#8F8F8F] rounded text-black transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
    </div>
  );
};

export default PaymentFailed;
