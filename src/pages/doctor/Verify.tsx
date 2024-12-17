import {  useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { useEffect, useState } from 'react';
import api from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const Verify = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { name, email, KycVerified } = useSelector((state: RootState) => state.doctor);

  const fetchProfileData = async () => {
    try {
      // await api.get('/doctor/profile');
      // setdoctorName(response.data.name)
      // setEmail(response.data.email)
      // setKycVerified(response.data.kycVerified)    
      // dispatch(changeKycStatus(response.data.kycVerified))        
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Form state  
  const [formData, setFormData] = useState({
    name: name || '', // Pre-fill the name from state
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
    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('regNo', formData.regNo);
    submissionData.append('yearOfReg', formData.yearOfReg);
    submissionData.append('medicalCouncil', formData.medicalCouncil);
    if (formData.proofFile) {
      submissionData.append('proofFile', formData.proofFile);
    }

    try {
      const response = await api.post(
        '/doctor/verify',
        submissionData,
      );

      const data = response.data;
      if (data) {
        toast.success('Success, Now wait for the approval.');
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <DoctorHeader />
      <div className="container mx-auto p-8 pt-24">
        {/* Doctor Info */}
        <p className="mb-4">Name: {name}</p>
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
                type="number"
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
            onClick={handleSubmit}
            className={`${isSubmitting ? 'bg-gray-200' : 'bg-white '
              }  font-semibold w-full py-1 bg-white text-black px-4 rounded-lg shadow-md hover:shadow-lg hover: border`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
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
