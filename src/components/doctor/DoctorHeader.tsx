import React from 'react';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaClipboardList, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const DoctorHeader: React.FC = () => {
    const location = useLocation();

    // Function to determine if a link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-black shadow-md py-4 px-8 flex justify-between items-center">
            {/* Left Section: DocMate Title */}
            <div className="text-2xl font-bold text-white">
                DocMate
            </div>

            {/* Right Section: Menu Items */}
            <nav className="flex items-center space-x-6 text-white">
                {/* Navigation Options */}
                <a href="/doctor/appointments" className={`hover:text-gray-400 flex items-center ${isActive('/appointments') ? 'text-yellow-400' : ''}`}>
                    <FaCalendarAlt className="mr-2" />
                    Appointment
                </a>

                <a href="/doctor/history" className={`hover:text-gray-400 flex items-center ${isActive('/history') ? 'text-yellow-400' : ''}`}>
                    <FaHistory className="mr-2" />
                    History
                </a>

                <a href="/doctor/verify" className={`hover:text-gray-400 flex items-center ${isActive('/verification') ? 'text-yellow-400' : ''}`}>
                    <FaCheckCircle className="mr-2" />
                    Verification
                </a>

                <a href="/doctor/manage-token" className={`hover:text-gray-400 flex items-center ${isActive('/manage-token') ? 'text-yellow-400' : ''}`}>
                    <FaClipboardList className="mr-2" />
                    Manage Token
                </a>

                {/* Message Icon */}
                <a href="/doctor/messages" className={`hover:text-gray-400 ${isActive('/messages') ? 'text-yellow-400' : ''}`}>
                    <FaEnvelope size={20} />
                </a>

                {/* Profile Icon */}
                <a href="/doctor/profile" className={`hover:text-gray-400 ${isActive('/profile') ? 'text-yellow-400' : ''}`}>
                    <FaUserCircle size={30} />
                </a>
            </nav>
        </header>
    );
};

export default DoctorHeader;
