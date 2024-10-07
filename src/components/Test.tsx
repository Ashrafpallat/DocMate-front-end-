import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const LocationAutocomplete: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

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
            setLocation(place.formatted_address || "");
          }
        });
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="Enter location"
      className="p-2 mt-1 border rounded-lg"
    />
  );
};

export default LocationAutocomplete;
