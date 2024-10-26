import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/axiosInstance';
import PatientHeader from '../../components/patient/PatientHeader';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  locationName: string;
  profilePhoto: string;
  experience: string;
  workingTime: string;
  distance: string;
}

const DoctorsNearby: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat');
  const lng = params.get('lng');
  const searchedLocation = params.get('location');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);

  useEffect(() => {
    if (lat && lng) {
      fetchDoctorsNearby(lat, lng);
    }
  }, [lat, lng, specializationFilter, experienceFilter]);

  const fetchDoctorsNearby = async (latitude: string, longitude: string) => {
    try {
      const response = await api.get('/patient/nearby-doctors', {
        params: {
          lat: latitude,
          lng: longitude,
          specialization: specializationFilter.join(','), // Send selected specializations as a comma-separated list
          experience: experienceFilter,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSpecializationChange = (specialization: string) => {
    setSpecializationFilter((prev) =>
      prev.includes(specialization)
        ? prev.filter((item) => item !== specialization)
        : [...prev, specialization]
    );
  };

  const handleExperienceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExperienceFilter(event.target.value || null);
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
                  <input
                    type="checkbox"
                    value="Cardiology"
                    checked={specializationFilter.includes('Cardiology')}
                    onChange={() => handleSpecializationChange('Cardiology')}
                    className="mr-2"
                  />
                  Surgeon
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    value="Dermatology"
                    checked={specializationFilter.includes('Dermatology')}
                    onChange={() => handleSpecializationChange('Dermatology')}
                    className="mr-2"
                  />
                  General Medicine
                </label>
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <select
                className="w-full border border-gray-300 rounded-lg p-2"
                onChange={handleExperienceChange}
                value={experienceFilter || ''}
              >
                <option value="">Select experience</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
              </select>
            </div>
          </aside>

          {/* Doctors List */}
          <div className="flex-grow">
            <h1 className="text-2xl font-semibold mb-6">Doctors Near {searchedLocation}</h1>

            {doctors.length > 0 ? (
              <ul>
                {doctors.map((doctor) => (
                  <Link
                    to="/patient/view-slotes"
                    state={{ doctor }}
                    key={doctor.id}
                  >
                    <li className="bg-white p-6 rounded-lg shadow-md mb-6 flex">
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
                      </div>
                    </li>
                  </Link>
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
