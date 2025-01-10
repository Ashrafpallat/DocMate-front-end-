import  { useEffect, useState } from 'react';
import { getHistory } from '../../services/doctorServices';
import DoctorHeader from '../../components/doctor/DoctorHeader';

const Wallet = () => {
    const [consultations, setConsultations] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const data = await getHistory(); // Assuming data is an array of consultations
                setConsultations(data);

                // Calculate total earnings
                const total = data.length * 200; // Assuming 200 is the consultation fee
                const doctorShare = total - total * 0.02; // Deducting 2% admin fee
                setTotalEarnings(doctorShare);
            } catch (error) {
                console.error("Error fetching prescription history", error);
            }
        };
        fetchPrescriptions();
    }, []);

    return (
        <div>
            <DoctorHeader />
            <div className="pt-28 flex flex-col items-center ">
                <div className="bg-white shadow-lg rounded-lg w-3/4 max-w-md p-6">
                    <h2 className="text-2xl font-semibold text-center mb-4">Wallet</h2>
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <span className="text-gray-600">Total Consultations:</span>
                        <span className="text-lg font-medium">{consultations.length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <span className="text-gray-600">Consultation Fee (per patient):</span>
                        <span className="text-lg font-medium">₹200</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <span className="text-gray-600">Admin Fee (2%):</span>
                        <span className="text-lg font-medium">-₹{(consultations.length * 200 * 0.02).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Doctor's Earnings:</span>
                        <span className="text-xl font-bold text-green-500">₹{totalEarnings.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
