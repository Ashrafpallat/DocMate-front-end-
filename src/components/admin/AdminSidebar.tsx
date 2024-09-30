import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-600 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/verify" className="block py-2 px-4 hover:bg-gray-600 rounded">
            Verify
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
