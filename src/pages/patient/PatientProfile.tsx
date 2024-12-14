import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';
import Footer from '../../components/Footer';

const PatientProfile = () => {
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    email: '',
    age: '',
    profilePhoto: null as File | null, // Profile photo URL
    location: ''
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean | null>(false)
  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/patient/profile');
      setProfileDetails(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Call fetch function when component is mounted
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Update photo preview when a new photo is selected
  useEffect(() => {
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedPhoto);
    } else {
      setPhotoPreview(null);
    }
  }, [selectedPhoto]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  // Handle file input change for profile photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file 

    if (file) {
      setSelectedPhoto(file);
      setProfileDetails({ ...profileDetails, profilePhoto: e.target.files ? e.target.files[0] : null })
    }
    console.log(profileDetails);

  };

  // Open the hidden file input when the div is clicked
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submit for updating details
  const handleUpdateClick = async () => {
    try {
      const submissionData = new FormData(); // Create a new instance of FormData
      submissionData.append('name', profileDetails.name); // Access name from state
      submissionData.append('email', profileDetails.email); // Access name from state
      submissionData.append('age', profileDetails.age); // Access name from state
      submissionData.append('location', profileDetails.location); // Access name from state

      if (profileDetails.profilePhoto) {
        submissionData.append('profilePhoto', profileDetails.profilePhoto);
      }
      console.log(submissionData);
      setSubmitting(true)
      const response = await api.post('/patient/profile', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      setProfileDetails({ ...response.data });
      toast.success('Details Updated');
      console.log('Details updated');
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      {/* Header */}
      <PatientHeader />
    {/* <ToastContainer/> */}
      {/* Profile Container */}
      <div className="container mx-auto p-6 pt-11">
        <h1 className="text-center text-2xl font-bold mb-6">Personal Details</h1>
        <div className=" rounded-lg p-8 max-w-6xl mx-auto ">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Profile Photo */}
            <div className="flex justify-center items-center">
              <div
                className="w-full h-auto hover:cursor-pointer"
                onClick={handlePhotoClick}
              >
                <img
                  src={
                    photoPreview ||
                    (profileDetails.profilePhoto instanceof File
                      ? URL.createObjectURL(profileDetails.profilePhoto)
                      : profileDetails.profilePhoto) ||
                    'https://via.placeholder.com/300x200'
                  }
                  alt="Profile"
                  className="rounded-lg shadow-md object-cover"
                  style={{ height: 'auto', width: '100%' }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }} // Hide the file input
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="col-span-2">
              {/* Name */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-600 font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileDetails.name}
                  onChange={handleChange}
                  className="p-2 mt-1 border rounded-lg"
                />
              </div>
 
              {/* Email */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-600 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileDetails.email}
                  onChange={handleChange}
                  className="p-2 mt-1 border rounded-lg"
                />
              </div>

              {/* Age */}
              <div className="flex flex-col mb-4">
                <label className="text-gray-600 font-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profileDetails.age}
                  onChange={handleChange}
                  className="p-2 mt-1 border rounded-lg"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col mb-6">
                <label className="text-gray-600 font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileDetails.location}
                  onChange={handleChange}
                  className="p-2 mt-1 border rounded-lg"
                />
              </div>

              {/* Update Button */}
              <div className="text-center">
                <button
                  onClick={handleUpdateClick}
                  className="w-full py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-gray-800"
                >
                  {submitting ? 'Updating...' : 'Update Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>

  );
};

export default PatientProfile;
