import React, { useEffect, useState } from "react";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import Modal from "react-modal";
import api from "../../services/axiosInstance";
import Prescription from '../../Interfaces.ts/prescriptionInterface'
const History: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response  = await api.get(`/doctor/history`);
        setPrescriptions(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching prescription history", error);
      }
    };
    fetchPrescriptions();
  }, []);

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.patientId && prescription.patientId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <DoctorHeader />
      <div className="container mx-auto p-4 pt-28">
        <h1 className="text-2xl font-semibold mb-4">Consultation History</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by patient name..."
            className="border p-2 rounded w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Age</th>
              <th className="py-2 px-4 border">Gender</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((prescription) => (
              <tr key={prescription._id}>
                <td className="py-2 px-4 border">{prescription.patientId.name || 'N/A'}</td>
                <td className="py-2 px-4 border">{prescription.patientId.email || 'N/A'}</td>
                <td className="py-2 px-4 border">{prescription.patientId.age || 'N/A'}</td>
                <td className="py-2 px-4 border">{prescription.patientId.gender || 'N/A'}</td>
                <td className="py-2 px-4 border">{prescription.patientId.location || 'N/A'}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleOpenModal(prescription)}
                  >
                    View Prescription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Prescription Details"
          className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-10"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          {selectedPrescription && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
              <div className="mb-4">
                <strong>Patient Name:</strong> {selectedPrescription.patientId.name}
              </div>
              <div className="mb-4">
                <strong>Symptoms:</strong> {selectedPrescription.symptoms}
              </div>
              <div className="mb-4">
                <strong>Diagnosis:</strong> {selectedPrescription.diagnosis}
              </div>
              <div className="mb-4">
                <strong>Medications:</strong> {selectedPrescription.medications}
              </div>
              <div className="mb-4">
                <strong>Date:</strong>{" "}
                {new Date(selectedPrescription.date).toLocaleDateString()}
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default History;
