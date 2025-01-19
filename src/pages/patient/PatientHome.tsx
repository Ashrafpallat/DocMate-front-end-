import React, { useEffect, useRef, useState } from "react";
import PatientHeader from "../../components/patient/PatientHeader";
import { FaSearch } from "react-icons/fa";
import backgroundImage from '../../assets/bg.png';
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";

const PatientHome: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(""); // Track input value
  const [debouncedValue, setDebouncedValue] = useState(""); // Debounced value

  useEffect(() => {
    console.log('start');
    
    const handler = setTimeout(() => {
      console.log('in timer');
      
      setDebouncedValue(inputValue);
      console.log(inputValue);
      
      console.log('debounced value in timer',debouncedValue);
       // Update the debounced value after a delay
    }, 500); // Delay of 500ms (adjustable)
    console.log('end');
    
    return () => {
      clearTimeout(handler);
      console.log('timer reseted');
       // Clear timeout if input changes
    };
  }, [inputValue]);

  useEffect(() => {
    // if (debouncedValue) {
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
              const selectedLocation = place.formatted_address || '';
              const lat = place.geometry.location?.lng();
              const lng = place.geometry.location?.lng();
              navigate(`/patient/doctors-nearby?location=${encodeURIComponent(selectedLocation)}&lat=${lat}&lng=${lng}`);
            }

          });
        }
      });
    // }
  }, [debouncedValue,navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update input value on change
  };

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
            value={inputValue}  
            onChange={handleChange}
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

export default PatientHome;
