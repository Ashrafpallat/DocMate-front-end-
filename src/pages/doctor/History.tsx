import React, { useEffect, useState } from "react";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import Modal from "react-modal";
import Prescription from "../../Interfaces/prescriptionInterface";
import { getHistory } from "../../services/doctorServices";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgress } from "@mui/material";

const History: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true)
        const data = await getHistory()
        setPrescriptions(data);
        setLoading(false)
        console.log(data);
      } catch (error) {
        console.error("Error fetching prescription history", error);
      }finally{
        setLoading(false)
      }
    };
    fetchPrescriptions();
  }, []);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPrescriptions = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...prescriptions].sort((a, b) => {
        const aValue = a.patientId?.[sortConfig.key] || "";
        const bValue = b.patientId?.[sortConfig.key] || "";
        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }
    return prescriptions;
  }, [prescriptions, sortConfig]);

  // Filter prescriptions based on search term
  const filteredPrescriptions = sortedPrescriptions.filter((prescription) =>
    prescription.patientId && prescription.patientId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

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
       {/* Table */}
  {loading ? ( // If loading, show spinner
    <div className="flex justify-center py-4">
      <CircularProgress />
    </div>
  ) : (
    <table className="min-w-full bg-white border rounded shadow">
      <thead>
        <tr className="bg-gray-100">
          <th
            className="py-2 px-4 border cursor-pointer"
            onClick={() => handleSort("name")}
          >
            Name {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th
            className="py-2 px-4 border cursor-pointer"
            onClick={() => handleSort("email")}
          >
            Email {sortConfig?.key === "email" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th
            className="py-2 px-4 border cursor-pointer"
            onClick={() => handleSort("age")}
          >
            Age {sortConfig?.key === "age" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th
            className="py-2 px-4 border cursor-pointer"
            onClick={() => handleSort("gender")}
          >
            Gender {sortConfig?.key === "gender" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th
            className="py-2 px-4 border cursor-pointer"
            onClick={() => handleSort("location")}
          >
            Location {sortConfig?.key === "location" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="py-2 px-4 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedPrescriptions.map((prescription) => (
          <tr key={prescription._id} className="text-center">
            <td className="py-2 px-4 border">{prescription.patientId.name || "N/A"}</td>
            <td className="py-2 px-4 border">{prescription.patientId.email || "N/A"}</td>
            <td className="py-2 px-4 border">{prescription.patientId.age || "N/A"}</td>
            <td className="py-2 px-4 border">{prescription.patientId.gender || "N/A"}</td>
            <td className="py-2 px-4 border">{prescription.patientId.location || "N/A"}</td>
            <td className="py-2 px-4 border">
              <button
                className="bg-[#996337] text-white px-4 py-2 rounded"
                onClick={() => handleOpenModal(prescription)}
              >
                <VisibilityIcon fontSize="small" />
                Prescription
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

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
                <strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}
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
