import React, { useEffect, useRef, useState } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { toast } from 'react-toastify';
import api from '../../services/axiosInstance';
import { Loader } from "@googlemaps/js-api-loader";


const MyProfile = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [profileDetails, setProfileDetails] = useState({
    name: '',
    email: '',
    age: '',
    specialization: '',
    fees: '',
    profilePhoto: null as File | null, // Profile photo URL
    locationName: '',
    latitude: '',
    longitude: '',
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // State for selected photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // State for previewing the selected photo

  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/doctor/profile');
      setProfileDetails(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Call fetch function when component is mounted
  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,  // Access the API key from Vite's env variables
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const latitude = place.geometry.location?.lng()
            const longitude = place.geometry.location?.lng();
            setProfileDetails((prevDetails) => ({
              ...prevDetails,  // Spread previous details to ensure you don't lose any data
              location: place.formatted_address || '',
              latitude: latitude?.toString() || '',
              longitude: longitude?.toString() || '',
            }));                   
          }
        });
      }
    });
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
      submissionData.append('specialization', profileDetails.specialization); // Access name from state
      submissionData.append('fees', profileDetails.fees); // Access name from state
      submissionData.append('location', profileDetails.locationName); // Access name from state
      submissionData.append('latitude', profileDetails.latitude)
      submissionData.append('longitude', profileDetails.longitude)

      if (profileDetails.profilePhoto) {
        submissionData.append('profilePhoto', profileDetails.profilePhoto);
      }
      console.log(submissionData);

      const response = await api.post('/doctor/profile', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      setProfileDetails({ ...response.data });
      toast.success('Details Updated');
      console.log('Details updated');
    } catch (error) {
      console.error('Error updating profile', error);
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
            <div className="w-40 h-40 hover:cursor-pointer" onClick={handlePhotoClick}>
              <img
                src={
                  photoPreview // Use preview if available
                  || (profileDetails.profilePhoto instanceof File
                    ? URL.createObjectURL(profileDetails.profilePhoto)
                    : profileDetails.profilePhoto) // If profilePhoto is a string (URL), use it. If it's a File, create a preview URL
                  || 'https://via.placeholder.com/150'
                }
                alt="Profile"
                className="rounded-full shadow-md"
                style={{ height: '150px', width: '150px' }}
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
                ref={inputRef}
                type="text"
                name="location"
                value={profileDetails.locationName}
                // onChange={handleChange}
                className="p-2 mt-1 border rounded-lg"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="text-center">
            <button
              onClick={handleUpdateClick}
              className="w-full py-1 bg-white text-black font-semibold rounded-lg shadow-md hover:shadow-lg hover:border"
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
