import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/axiosInstance';
import PatientHeader from '../../components/patient/PatientHeader';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  locationName: string
  profilePhoto: string
  experience: string
  workingTime: string
  distance: string; // Assuming you will calculate distance based on the coordinates
}

const DoctorsNearby: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat');
  const lng = params.get('lng');
  const searchedLocation = params.get('location')

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Fetch doctors based on coordinates
  useEffect(() => {
    if (lat && lng) {
      fetchDoctorsNearby(lat, lng);
    }
  }, [lat, lng]);

  const fetchDoctorsNearby = async (latitude: string, longitude: string) => {
    try {
      // Use the axios instance to make a GET request
      const response = await api.get('/patient/nearby-doctors', {
        params: {
          lat: latitude,
          lng: longitude,
        },
      });
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  };

  return (
    <div>
      <PatientHeader />
      <div className="bg-[#FAF9F6] min-h-screen p-6">

        <div className="flex mt-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white p-6 rounded-lg shadow-md mr-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Specialization Filters */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Specialization</h3>
              <div>
                <label className="block mb-2">
                  <input type="checkbox" value="Cardiology" className="mr-2" />
                  Cardiology
                </label>
                <label className="block mb-2">
                  <input type="checkbox" value="Dermatology" className="mr-2" />
                  Dermatology
                </label>
                <label className="block mb-2">
                  <input type="checkbox" value="Pediatrics" className="mr-2" />
                  Pediatrics
                </label>
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <select className="w-full border border-gray-300 rounded-lg p-2">
                <option value="">Select experience</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </aside>

          {/* Doctors List */}
          <div className="flex-grow">
            <h1 className="text-2xl font-semibold mb-6">Doctors Near {searchedLocation}</h1>

            {doctors.length > 0 ? (
              <ul>
                {doctors.map((doctor) => (
                  <li key={doctor.id} className="bg-white p-6 rounded-lg shadow-md mb-6 flex">
                    {/* Left: Profile Photo */}
                    <div className="mr-6">
                      <img
                        src={doctor.profilePhoto || `https://dummyimage.com/300.png/555/fff&text=+${doctor.name}`}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-3xl object-cover"
                      />
                    </div>

                    {/* Right: Doctor Details */}
                    <div>
                      <h3 className="text-xl font-bold">{doctor.name}</h3>
                      <p className="mt-2">Specialization: {doctor.specialization}</p>
                      <p>Experience: {doctor.experience} years</p>
                      <p>Location: {doctor.locationName}</p>
                      {/* <p>Working Hours: {doctor.workingTime}</p> */}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No doctors found near this location.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsNearby;
