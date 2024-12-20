import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutPatient } from "../../redux/patientSlice";
import { RootState } from "../../redux/store";
import { HiChatAlt2 } from "react-icons/hi";
import { patientLogout } from "../../services/patientServices";

const PatientHeader: React.FC = () => {
  const profilePhoto = useSelector((state: RootState) => state.patient.profilePhoto);
  const name = useSelector((state: RootState) => state.patient.name);

  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get the current route to determine the active tab
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      patientLogout()
      dispatch(logoutPatient());
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <header className="bg-black text-gray-400 p-6 flex justify-between items-center fixed w-full">
      {/* DocMate logo/text on the left side */}
      <Link
        to="/patient/home"
        className={`hover:text-white active:text-white ${location.pathname === "/patient/home" ? "text-white" : ""
          }`}
      >
        <div className="text-2xl font-bold">DocMate</div>
      </Link>

      {/* Navigation links on the right side */}
      <nav className="flex space-x-10 items-center">
        {/* <Link
          to="/patient/home"
          className={`hover:text-white ${
            location.pathname === "/patient/home" ? "text-white" : ""
          }`}
        >
          Home
        </Link> */}
        <Link
          to="/patient/appointments"
          className={`hover:text-white ${location.pathname === "/patient/appointments" ? "text-white" : ""
            }`}
        >
          Appointments
        </Link>
        <Link
          to="/patient/history"
          className={`hover:text-white ${location.pathname === "/patient/history" ? "text-white" : ""
            }`}
        >
          History
        </Link>
        <Link
          to="/patient/chatHome"
          className={`hover:text-white ${location.pathname === "/patient/chatHome" ? "text-white" : ""
            } flex items-center`}
        >
          <HiChatAlt2 size={28} />
        </Link>

        <div onClick={toggleDropdown} className="relative">
          <button>
            <img
              src={profilePhoto || `https://dummyimage.com/100x100/09f/fff&text=${name}`} // Placeholder image
              className="w-9 rounded-full object-cover" // Adjust size as needed
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
              <Link
                to="/patient/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default PatientHeader;
