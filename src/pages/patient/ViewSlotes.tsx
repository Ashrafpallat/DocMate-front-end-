import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientHeader from '../../components/patient/PatientHeader';
import api from '../../services/axiosInstance';

const ViewSlots = () => {
  const location = useLocation();
  const { doctor } = location.state || {}; // Access the passed doctor data
  interface Slot {
    start: string;
    end: string;
  }

  interface SlotsResponse {
    day: string;
    doctorId: string;
    slots: Slot[];
  }

  const [slots, setSlots] = useState<SlotsResponse[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (doctor && doctor._id) {
          const response = await api.get(`/doctor/${doctor._id}/slots`);
          console.log(response.data[0].slots);
          const slotsFromResponse = response.data;
          setSlots(slotsFromResponse);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();

  }, [doctor]); // Re-run the effect when the doctor object changes

  if (!doctor) {
    return <p>No doctor data available.</p>;
  } else {
    // console.log(slots);
  }

  return (
    <>
      <PatientHeader />
      <div className="p-6 bg-[#FAF9F6] min-h-screen">
        {/* Doctor Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex">
            <img
              src={doctor.profilePhoto || `https://dummyimage.com/300.png/555/fff&text=+${doctor.name}`}
              alt={doctor.name}
              className="w-24 h-24 rounded-3xl object-cover mr-6"
            />
            <div>
              <h3 className="text-2xl font-bold">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">Experience: {doctor.experience} years</p>
              <p className="text-gray-500">Location: {doctor.locationName}</p>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Available Slots</h3>
          {slots.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {slots[0].slots.map((slot, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 shadow-md min-w-[100px] text-center"
                >
                  <p>{slot.start} - {slot.end}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slots available.</p>
          )}

        </div>
      </div>
    </>
  );
};

export default ViewSlots;
