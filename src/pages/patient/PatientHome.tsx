import React, { useEffect, useRef } from "react";
import PatientHeader from "../../components/patient/PatientHeader";
import { FaSearch } from "react-icons/fa";
import backgroundImage from '../../assets/bg.png';
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";

const Verify: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY, // Access the API key from Vite's env variables
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
            // Get the selected location name and navigate to the next page
            const selectedLocation = place.formatted_address || '';
            navigate(`/doctors-nearby?location=${encodeURIComponent(selectedLocation)}`);
          }
        });
      }
    });
  }, [navigate]);

  return (
    <div>
      <PatientHeader />
      <div
        className="h-screen bg-cover bg-center flex items-center justify-center flex-col"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute top-32 w-96">
          <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your location"
            className="w-full py-4 pl-20 pr-4 text-gray-700 border border-gray-300 rounded-full"
          />
        </div>
        <div className='p-10 flex justify-center'>
          <p className='text-white text-lg text-center w'>
            In DocMate you can find by entering your location and <br />
            also you can filter according to various options like specialization and experience. <br />
            Doctors will add prescriptions for the patients, and patients can also access the prescriptions from their account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
