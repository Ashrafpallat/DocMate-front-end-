import {  useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/axiosInstance';

const Verify = () => {
  // const [isKycVerified, setisKycVerified] = useState(true)
  const { name: doctorName, email, KycVerified } = useSelector((state: RootState) => state.doctor);

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
    console.log(formData);
    
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
      const response = await api.post(
        '/doctor/verify',
        submissionData, // Ensure submissionData is properly formatted, e.g., as JSON or FormData
      );

      const data = response.data;
      if (data) {
        toast.success('Details submitted successfully, wait for approval.');
        console.log('Success:', data);
      } else {
        console.error('Error:', data.message);
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
  
      {/* KYC Status */}
      <div className="mb-6">
        {KycVerified ? (
          <p className="text-green-500 font-bold">KYC Verified</p>
        ) : (
          <p className="text-red-500 font-bold">KYC Not Verified</p>
        )}
      </div>
  
      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Doctor Verification</h2>
  
        {/* Two fields in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Name */}
          <div>
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
          <div>
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
        </div>
  
        {/* Two fields in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Year of Registration */}
          <div>
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
          <div>
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
            </select>
          </div>
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
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          Submit
        </button>
      </form>
  
      {/* Logout Button */}
      <div className="mt-6">
        {/* <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={handleLogout}
        >
          Logout
        </button> */}
      </div>
    </div>
  </div>
  
  );
};

export default Verify;
