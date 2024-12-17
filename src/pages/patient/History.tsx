import React, { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';
import Modal from "react-modal";
import toast from 'react-hot-toast';
import { Patient } from '../../Interfaces/patientInterface';
import Prescription from '../../Interfaces/prescriptionInterface';

const History: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true)
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };
  const handleAddReview = (doctorId: string) => {
    setModalVisible(true);
    setSelectedPrescription(prescriptions.find(p => p.doctorId._id === doctorId) || null);
  };

  const handleSubmitReview = () => {
    try {
      const doctorId = selectedPrescription?.doctorId._id
      console.log('Submitting review:', {
        doctorId: selectedPrescription?.doctorId._id,
        rating,
        reviewText,
      });
      api.post('/patient/add-review', { doctorId, rating, reviewText })
      toast.success('Review added successfully')
      setModalVisible(false);  // Close the modal
      setRating(0);  // Reset the rating
      setReviewText('');  // Clear the review text 
    } catch (error:any) {
      console.log('error saving review from front end',error);
      toast.error('error adding review',error)
    }

  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/patient/history');
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = prescriptions.filter((prescription) =>
      prescription.doctorId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
    setCurrentPage(1); // Reset to the first page after search
  }, [searchTerm, prescriptions]);

  // Sorting function
  const handleSort = (column: string) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setSortColumn(column);

    const sorted = [...filteredPrescriptions].sort((a, b) => {
      const aValue = column === 'date' ? new Date(a[column] as string).getTime() : a.doctorId[column as keyof typeof a.doctorId];
      const bValue = column === 'date' ? new Date(b[column] as string).getTime() : b.doctorId[column as keyof typeof b.doctorId];
      return newOrder === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
    setFilteredPrescriptions(sorted);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <PatientHeader />
      <div className="p-4 pt-24">
        <h2 className="text-xl font-semibold mb-6">Consultation History</h2>
        {loading && <p>Loading consultation history...</p>}
        {error && <p className="text-red-500"> {error}</p>}
        {!loading && !error && prescriptions.length === 0 && (
          <p>No consultation history found.</p>
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Doctor Name"
          className="border rounded p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 text-center">Photo</th>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer py-2 px-4 text-center"
                >
                  Doctor Name {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('specialization')}
                  className="cursor-pointer py-2 px-4 text-center"
                >
                  Specialization {sortColumn === 'specialization' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="cursor-pointer py-2 px-4 text-center"
                >
                  Date {sortColumn === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPrescriptions.map((prescription) => (
                <tr key={prescription._id} className="border-t">
                  {/* Doctor's Photo */}
                  <td className="py-2 px-4 flex justify-center">
                    <img
                      src={prescription.doctorId.profilePhoto}
                      alt={`${prescription.doctorId.name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  {/* Doctor's Name */}
                  <td className="py-2 px-4 text-center">{prescription.doctorId.name}</td>
                  {/* Specialization */}
                  <td className="py-2 px-4 text-center">{prescription.doctorId.specialization}</td>
                  {/* Date */}
                  <td className="py-2 px-4 text-center">
                    {new Date(prescription.date || '').toLocaleDateString()}
                  </td>
                  {/* Actions */}
                  <td className="py-2 px-4 text-center">
                    {/* Add Review Button */}
                    <button
                      onClick={() => handleAddReview(prescription.doctorId._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                      Add Review
                    </button>
                    {/* Show Prescription Button */}
                    <button
                      onClick={() => handleShowPrescription(prescription)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Show Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                        <strong>Date:</strong> {new Date(selectedPrescription.date || '').toLocaleDateString()}
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

        {/* Modal for Adding Review */}
        {modalVisible && selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Add Review for {selectedPrescription.doctorId.name}</h2>

              {/* Rating Stars */}
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <textarea
                placeholder="Write your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="border p-2 w-full h-32 mb-4 rounded"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitReview}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Submit
                </button>
                <button
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-300 px-4 py-2 rounded "
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
