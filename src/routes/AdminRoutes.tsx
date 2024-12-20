import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProtectedRoute from '../components/admin/adminProtectedRoute';
import AdminVerify from '../pages/admin/AdminVerify';
import PatientManagement from '../pages/admin/PatientManagement';
import DoctorManagement from '../pages/admin/DoctorManagement';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <AdminProtectedRoute>
            <Routes>
              <Route path="/verify" element={<AdminVerify />} />
              <Route path="/patients" element={<PatientManagement />} />
              <Route path="/doctors" element={<DoctorManagement />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
