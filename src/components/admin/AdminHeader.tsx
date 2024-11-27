import React, { useState } from 'react';
import { logout } from '../../redux/adminSlice';
import { useDispatch } from 'react-redux';

const AdminHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch()
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    console.log('Logged out');
    // Add your logout logic here (e.g., clearing tokens, redirecting, etc.)
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">DocMate</h1>
      <div className="relative">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={toggleDropdown}
        >
          <img
            src="https://dummyimage.com/300.png/1F2937/fff&text=+Admin" // Replace with the actual profile image URL
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          {/* <span className="hidden sm:inline text-sm font-medium">Admin</span> */}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
            <button
              onClick={() => dispatch(logout())}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
