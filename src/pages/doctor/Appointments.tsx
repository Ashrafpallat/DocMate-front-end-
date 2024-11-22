import React, { useState, useEffect } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import api from '../../services/axiosInstance';
import { toast } from 'react-toastify';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  location: string;
}

interface Slot {
  start: string;
  end: string;
  status: 'issued' | 'reserved' | 'consulted' | 'cancelled';
  patientId?: Patient;
}

interface DefaultToken {
  _id: string;
  day: string;
  slots: Slot[];
  doctorId: string;
  __v?: number;
}

const Appointments: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'Pending' | 'Consulted'>('Pending');
  const [appointments, setAppointments] = useState<DefaultToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('')
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get<DefaultToken[]>('/doctor/doctor/slotes');
        console.log(response.data);
        setAppointments(response.data);

      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredSlots = appointments.flatMap(token =>
    token.slots.filter(slot =>
      (selectedTab === 'Pending' && slot.status === 'reserved') ||
      (selectedTab === 'Consulted' && slot.status === 'consulted')
    )
  );

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to handle opening the popup
  const handleConsultClick = (patientId: string) => {
    setPatientId(patientId)
    setIsPopupVisible(true);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };
  interface PrescriptionData {
    symptoms: string;
    diagnosis: string;
    medications: string;
  }
  const [formData, setFormData] = useState<PrescriptionData>({
    symptoms: '',
    diagnosis: '',
    medications: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/doctor/prescription', { ...formData, patientId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        toast.success('Prescription saved successfully');
        console.log('Prescription saved successfully');

        handleClosePopup();
      } else {
        console.error('Failed to save prescription');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  return (
    <div className="bg-[#FAF9F6] h-screen flex">
      <DoctorHeader />

      {/* Sidebar */}
      <div className="bg-black text-white w-1/5 p-4 pt-24">
        <ul>
          <li
            className={`cursor-pointer p-2 ${selectedTab === 'Pending' ? 'bg-gray-700' : ''}`}
            onClick={() => setSelectedTab('Pending')}
          >
            Pending
          </li>
          <li
            className={`cursor-pointer p-2 ${selectedTab === 'Consulted' ? 'bg-gray-700' : ''}`}
            onClick={() => setSelectedTab('Consulted')}
          >
            Consulted
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 pt-28">
        {/* <h1 className="text-2xl font-semibold mb-4">{selectedTab} Appointments</h1> */}

        {loading ? (
          <p>Loading appointments...</p>
        ) : filteredSlots.length === 0 ? (
          <p className=" text-lg ">No Pending Appointments</p>
        ) : (
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-4 border">Time Slot</th>
                <th className="p-4 border">Name</th>
                <th className="p-4 border">Age</th>
                <th className="p-4 border">Gender</th>
                <th className="p-4 border">Location</th>
                <th className="p-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map((slot, index) => (
                <tr key={index} className="text-left">
                  <td className="p-4 border">{`${slot.start} - ${slot.end}`}</td>
                  <td className="p-4 border">{slot.patientId?.name || 'N/A'}</td>
                  <td className="p-4 border">{slot.patientId?.age || 'N/A'}</td>
                  <td className="p-4 border">{slot.patientId?.gender || 'N/A'}</td>
                  <td className="p-4 border">{slot.patientId?.location || 'N/A'}</td>
                  <td className="p-4 border">
                    {slot.status === 'reserved' && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleConsultClick(slot.patientId?._id || 'N/A')}
                      >
                        Consult
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
      {/* Popup Form */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Consultation Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Symptoms</label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter symptoms"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter diagnosis"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Medications</label>
                <input
                  type="text"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter medications"
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
