import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProtectedRoute from '../components/admin/adminProtectedRoute';
import AdminVerify from '../pages/admin/AdminVerify';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/verify" element={<AdminVerify />} />
      <Route path="/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes;
