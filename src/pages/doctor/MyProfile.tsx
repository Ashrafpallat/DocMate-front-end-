import React, { useEffect, useState } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const [profileDetails, setProfileDetails] = useState({
      name: '',
      email: '',
      age: '',
      specialization: '',
      fees: '',
      location: ''
    });
    const fetchProfileData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/doctor/profile', { withCredentials: true });          
          setProfileDetails(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
    
      // Call fetch function when component is mounted
      useEffect(() => {
        fetchProfileData();
      }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  // Handle form submit for updating details
  const handleUpdateClick = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/doctor/profile', profileDetails, {withCredentials: true})
        setProfileDetails({...response.data})
        toast.success('Details Updated')
        console.log('details updated');
    } catch (error) {
        console.error('error updating profile',error)
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      {/* Header */}
      <DoctorHeader />

      {/* Profile Container */}
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-6xl mx-auto">
          {/* Profile Photo and Name */}
          <div className="flex justify-center items-center mb-6">
            <div className="w-32 h-32">
              <img
                src="https://via.placeholder.com/150" // Placeholder image, replace with profile photo URL
                alt="Profile"
                className="rounded-full shadow-md"
              />
            </div>
          </div>

          {/* Name under profile photo */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold">{profileDetails.name}</h3>
          </div>

          {/* Editable Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={profileDetails.name}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={profileDetails.email}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Age</label>
              <input
                type="number"
                name="age"
                value={profileDetails.age}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profileDetails.specialization}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Consultation Fees</label>
              <input
                type="text"
                name="fees"
                value={profileDetails.fees}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={profileDetails.location}
                onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="text-center">
            <button
              onClick={handleUpdateClick}
              className="px-6 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-black"
            >
              Update Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
