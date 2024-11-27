import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation(); // Get the current route

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/verify', label: 'Verify' },
    {path: '/admin/patients', label: 'Patients'},
  ];

  return (
    <div className="bg-gray-800 text-white h-screen w-64 p-4">
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block py-2 px-4 rounded ${
                location.pathname === link.path
                  ? 'bg-gray-600 font-bold' // Highlight for active tab
                  : 'hover:bg-gray-600'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
