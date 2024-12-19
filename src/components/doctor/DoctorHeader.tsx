import React, { useState } from 'react';
import { HiChatAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logoutDoctor } from '../../redux/doctorSlice';
import { RootState } from '../../redux/store';
import { doctorLogout } from '../../services/doctorServices';

const DoctorHeader: React.FC = () => {
    const profilePhoto = useSelector((state: RootState) => state.doctor.profilePhoto);
    const name = useSelector((state: RootState) => state.doctor.name);

    // Function to determine if a link is active
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            doctorLogout()
            dispatch(logoutDoctor());
        } catch (error) {
            console.log('error while logout API call', error);
        }
    };

    return (
        <header className="bg-black shadow-md py-6 px-8 flex justify-between items-center fixed w-full">
            {/* Left Section: DocMate Title */}
            <div className={`text-2xl font-bold ${isActive('/doctor/dashboard') ? 'text-white' : 'text-gray-400'} hover:text-white`}>
                <Link to="/doctor/dashboard" title="Dashboard">
                    DocMate
                </Link>
            </div>

            {/* Right Section: Menu Items */}
            <nav className="flex items-center space-x-10 text-gray-400">
                {/* Navigation Options */}
                <Link
                    to="/doctor/appointments"
                    className={`hover:text-white flex items-center ${isActive('/doctor/appointments') ? 'text-white' : ''}`}
                >
                    Appointment
                </Link>

                <Link
                    to="/doctor/history"
                    className={`hover:text-white flex items-center ${isActive('/doctor/history') ? 'text-white' : ''}`}
                >
                    History
                </Link>

                <Link
                    to="/doctor/verify"
                    className={`hover:text-white flex items-center ${isActive('/doctor/verify') ? 'text-white ' : ''}`}
                >
                    Verification
                </Link>

                <Link
                    to="/doctor/manage-token"
                    className={`hover:text-white flex items-center ${isActive('/doctor/manage-token') ? 'text-white' : ''}`}
                >
                    Manage Token
                </Link>
                <Link
                    to="/doctor/reviews"
                    className={`hover:text-white flex items-center ${isActive('/doctor/reviews') ? 'text-white' : ''}`}
                >
                    Reveiws
                </Link>

                {/* Message Icon */}
                <Link
                    to="/doctor/messages"
                    className={`hover:text-white ${isActive('/doctor/messages') ? 'text-white' : ''}`}
                >
                    <HiChatAlt2 size={28} />
                </Link>

                {/* Profile Icon with Dropdown */}
                <div className="relative" onClick={toggleDropdown}>
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
                                to="/doctor/profile"
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

export default DoctorHeader;
