import axios from 'axios';
import React, { useState } from 'react';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaClipboardList, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../redux/doctorSlice';

const DoctorHeader: React.FC = () => {
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
            await axios.post('http://localhost:5000/api/doctor/logout', {}, { withCredentials: true });
            dispatch(logout());
        } catch (error) {
            console.log('error while logout API call', error);
        }
    };

    return (
        <header className="bg-black shadow-md py-4 px-8 flex justify-between items-center">
            {/* Left Section: DocMate Title */}
            <div className="text-2xl font-bold text-white">
                <Link to="/doctor/dashboard">DocMate</Link>
            </div>

            {/* Right Section: Menu Items */}
            <nav className="flex items-center space-x-10 text-gray-400">
                {/* Navigation Options */}
                <Link
                    to="/doctor/appointments"
                    className={`hover:text-white flex items-center ${isActive('/doctor/appointments') ? 'text-white' : ''}`}
                >
                    <FaCalendarAlt className="mr-2" />
                    Appointment
                </Link>

                <Link
                    to="/doctor/history"
                    className={`hover:text-white flex items-center ${isActive('/doctor/history') ? 'text-white' : ''}`}
                >
                    <FaHistory className="mr-2" />
                    History
                </Link>

                <Link
                    to="/doctor/verify"
                    className={`hover:text-white flex items-center ${isActive('/doctor/verify') ? 'text-white ' : ''}`}
                >
                    <FaCheckCircle className="mr-2" />
                    Verification
                </Link>

                <Link
                    to="/doctor/manage-token"
                    className={`hover:text-white flex items-center ${isActive('/doctor/manage-token') ? 'text-white' : ''}`}
                >
                    <FaClipboardList className="mr-2" />
                    Manage Token
                </Link>

                {/* Message Icon */}
                <Link
                    to="/doctor/messages"
                    className={`hover:text-white ${isActive('/doctor/messages') ? 'text-white' : ''}`}
                >
                    <FaEnvelope size={20} />
                </Link>

                {/* Profile Icon with Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown} // Function to toggle dropdown visibility
                        className={`hover:text-white focus:outline-none ${isActive('/doctor/profile') ? 'text-white' : ''}`}
                    >
                        <FaUserCircle size={30} />
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
