import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/axiosInstance';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  distance: string; // Assuming you will calculate distance based on the coordinates
}

const DoctorsNearby: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat');
  const lng = params.get('lng');

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
      <h1>Doctors Near Your Location (Lat: {lat}, Lng: {lng})</h1>
      {doctors.length > 0 ? (
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.id}>
              <h3>{doctor.name}</h3>
              <p>Specialization: {doctor.specialization}</p>
              {/* <p>Distance: {doctor.distance} km</p> */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors found near this location.</p>
      )}
    </div>
  );
};

export default DoctorsNearby;
