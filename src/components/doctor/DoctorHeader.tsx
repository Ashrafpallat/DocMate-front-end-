import axios from 'axios';
import React, { useState } from 'react';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaClipboardList, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { logout } from '../../redux/doctorSlice';

const DoctorHeader: React.FC = () => {
    // Function to determine if a link is active
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;    
    const dispatch = useDispatch()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    
    const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault
    try {
      await axios.post('http://localhost:5000/api/doctor/logout', {}, { withCredentials: true });
      dispatch(logout())
    } catch (error) {
      console.log('error while logout api call', error);
    }
  }
    
    return (
        <header className="bg-black shadow-md py-4 px-8 flex justify-between items-center">
  {/* Left Section: DocMate Title */}
  <div className="text-2xl font-bold text-white">
    <a href="/doctor/dashboard">DocMate</a>
  </div>

  {/* Right Section: Menu Items */}
  <nav className="flex items-center space-x-10 text-gray-400">
    {/* Navigation Options */}
    <a
      href="/doctor/appointments"
      className={`hover:text-white flex items-center ${isActive('/doctor/appointments') ? 'text-yellow-400' : ''}`}
    >
      <FaCalendarAlt className="mr-2" />
      Appointment
    </a>

    <a
      href="/doctor/history"
      className={`hover:text-white flex items-center ${isActive('/doctor/history') ? 'text-yellow-400' : ''}`}
    >
      <FaHistory className="mr-2" />
      History
    </a>

    <a
      href="/doctor/verify"
      className={`hover:text-white flex items-center ${isActive('/doctor/verify') ? 'text-white ' : ''}`}
    >
      <FaCheckCircle className="mr-2" />
      Verification
    </a>

    <a
      href="/doctor/manage-token"
      className={`hover:text-white flex items-center ${isActive('/doctor/manage-token') ? 'text-yellow-400' : ''}`}
    >
      <FaClipboardList className="mr-2" />
      Manage Token
    </a>

    {/* Message Icon */}
    <a
      href="/doctor/messages"
      className={`hover:text-white ${isActive('/messages') ? 'text-yellow-400' : ''}`}
    >
      <FaEnvelope size={20} />
    </a>

    {/* Profile Icon with Dropdown */}
    <div className="relative">
      <button
        onClick={toggleDropdown} // Function to toggle dropdown visibility
        className={`hover:text-white focus:outline-none ${isActive('/profile') ? 'text-yellow-400' : ''}`}
      >
        <FaUserCircle size={30} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          <a
            href="/doctor/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Profile
          </a>
          <a
            href=""
            onClick={handleLogout} // Handle logout functionality
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  </nav>
</header>

    );
};

export default DoctorHeader;
