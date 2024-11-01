import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/axiosInstance';
import PatientHeader from '../../components/patient/PatientHeader';
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat');
  const lng = params.get('lng');
  const searchedLocation = params.get('location');

  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specializationFilter, setSpecializationFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);

  const [page, setPage] = useState(1); // Track the current page
  const [totalItems, setTotalItems] = useState<number>(0); 
  const itemsPerPage = 3
  const totalPages = Math.ceil(totalItems / itemsPerPage); 

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages)); 
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); 
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber); 
  };

  useEffect(() => {
    // Fetch all doctors nearby once without filters
    if (lat && lng) {
      fetchDoctorsNearby(lat, lng, page);
    }
  }, [lat, lng, page]);

  useEffect(() => {
    // Apply filters on the client side whenever filters change
    applyFilters();
  }, [specializationFilter, experienceFilter, allDoctors]);

  const fetchDoctorsNearby = async (latitude: string, longitude: string, page: number) => {
    const limit = 3; 
    try {
      const response = await api.get('/patient/nearby-doctors', {
        params: { lat: latitude, lng: longitude, page, limit },
      });
      setTotalItems(response.data.totalCount)
      setAllDoctors(response.data.doctors); 
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const applyFilters = () => {
    let filtered = allDoctors;

    if (specializationFilter.length > 0) {
      filtered = filtered.filter((doctor) => specializationFilter.includes(doctor.specialization));
    }

    if (experienceFilter) {
      filtered = filtered.filter((doctor) => Number(doctor.experience) == Number(experienceFilter));
    }
    setFilteredDoctors(filtered);
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
      <div className="bg-[#FAF9F6] min-h-screen p-6 pt-16">
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
                    value="Surgeon"
                    checked={specializationFilter.includes('Surgeon')}
                    onChange={() => handleSpecializationChange('Surgeon')}
                    className="mr-2"
                  />
                  Surgeon
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    value="General Medicine"
                    checked={specializationFilter.includes('General Medicine')}
                    onChange={() => handleSpecializationChange('General Medicine')}
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
                <option value="">All years</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
              </select>
            </div>
          </aside>

          {/* Doctors List */}
          <div className="flex-grow">
            <h1 className="text-2xl font-semibold mb-6">Doctors Near {searchedLocation}</h1>

            {filteredDoctors.length > 0 ? (
              <ul>
                {filteredDoctors.map((doctor) => (
                  <Link
                    to="/patient/view-slotes"
                    state={{ doctor }}
                    key={doctor.id}
                  >
                    <li className="bg-white p-6 rounded-lg shadow-md mb-6 flex">
                      <div className="mr-6">
                        <img
                          src={doctor.profilePhoto || `https://dummyimage.com/300.png/555/fff&text=+${doctor.name}`}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-3xl object-cover"
                        />
                      </div>
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
            {/* Pagination Section */}
            <div className="flex gap-2 justify-self-center bg-white rounded-full shadow-md p-2 w-fit">
              <button
                className=" px-5 rounded text-gray-500"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <GrPrevious/>
              </button>

              {/* Dynamic Page Numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 rounded-full text-gray-700 ${page === pageNumber ? 'bg-black text-white' : ''
                      }`}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className=" px-5 rounded text-gray-500"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                < GrNext />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsNearby;
