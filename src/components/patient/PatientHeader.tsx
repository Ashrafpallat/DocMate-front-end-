import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/patientSlice";
import { RootState } from "../../redux/store";

const PatientHeader: React.FC = () => {
    const profilePhoto = useSelector((state: RootState) => state.patient.profilePhoto);
    const name = useSelector((state: RootState) => state.patient.name);

    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleLogout = async () => {
        try {
            console.log("loguot api sending..");

            await axios.post(
                "http://localhost:5000/api/patient/logout",
                {},
                { withCredentials: true }
            );

            console.log("api reutuned");

            dispatch(logout());
        } catch (error) {
            console.error("Error during logout", error);
        }
    };
    return (
        <header className="bg-black text-white p-4 flex justify-between items-center">
            {/* DocMate logo/text on the left side */}
            <Link to={'/patient/home'}>
                <div className="text-2xl font-bold">DocMate</div>
            </Link>
            {/* Navigation links on the right side */}
            <nav className="flex space-x-10 items-center">
                <Link to="/patient/home" className="hover:text-gray-400">
                    Home
                </Link>
                <Link to="/patient/appointments" className="hover:text-gray-400">
                    Appointments
                </Link>
                <Link to="/messages" className="hover:text-gray-400">
                    <FaEnvelope size={20} />
                </Link>
                <div onClick={toggleDropdown}>
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
                                onClick={handleLogout} // Handle logout functionality
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
