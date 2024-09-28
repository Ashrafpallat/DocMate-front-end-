import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/doctorSlice';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { useState } from 'react';

const Verify = () => {
  const dispatch = useDispatch();
  const { name: doctorName, email } = useSelector((state: RootState) => state.doctor);

  // Form state
  const [formData, setFormData] = useState({
    name: doctorName || '', // Pre-fill the name from state
    regNo: '',
    yearOfReg: '',
    medicalCouncil: '',
    proofFile: null as File | null, // Ensure proofFile can be a File or null
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file change for proof upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      proofFile: e.target.files ? e.target.files[0] : null, // Ensure null if no file is selected
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const submissionData = new FormData(); // Create a new instance of FormData
    submissionData.append('name', formData.name); // Access name from state
    submissionData.append('regNo', formData.regNo);
    submissionData.append('yearOfReg', formData.yearOfReg);
    submissionData.append('medicalCouncil', formData.medicalCouncil);
    if (formData.proofFile) {
      submissionData.append('proofFile', formData.proofFile);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/doctor/verify', { // Updated URL
        method: 'POST',
        body: submissionData,
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Success:', data);
        // Optionally show a success message or redirect the user
      } else {
        console.error('Error:', data.message);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <DoctorHeader />

      <div className="container mx-auto p-8">
        {/* Doctor Info */}
        <p className="mb-4">Name: {doctorName}</p>
        <p className="mb-4">Email: {email}</p>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6">Doctor Verification</h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Registration Number */}
          <div className="mb-4">
            <label htmlFor="regNo" className="block text-gray-700 font-semibold mb-2">
              Registration Number:
            </label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Year of Registration */}
          <div className="mb-4">
            <label htmlFor="yearOfReg" className="block text-gray-700 font-semibold mb-2">
              Year of Registration:
            </label>
            <input
              type="text"
              id="yearOfReg"
              name="yearOfReg"
              value={formData.yearOfReg}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* State Medical Council */}
          <div className="mb-4">
            <label htmlFor="medicalCouncil" className="block text-gray-700 font-semibold mb-2">
              State Medical Council:
            </label>
            <select
              id="medicalCouncil"
              name="medicalCouncil"
              value={formData.medicalCouncil}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Council</option>
              <option value="Kerala Medical Council">Kerala Medical Council</option>
              <option value="Tamil Nadu Medical Council">Tamil Nadu Medical Council</option>
              <option value="Karnataka Medical Council">Karnataka Medical Council</option>
              {/* Add more options as necessary */}
            </select>
          </div>

          {/* Upload Proof */}
          <div className="mb-4">
            <label htmlFor="proofFile" className="block text-gray-700 font-semibold mb-2">
              Upload Proof (e.g., PAN Card):
            </label>
            <input
              type="file"
              id="proofFile"
              name="proofFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            Submit
          </button>
        </form>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
