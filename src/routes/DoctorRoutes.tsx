import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from '../pages/doctor/Singup';
import Login from '../pages/doctor/Login';
import Verify from '../pages/doctor/Verify';
import ProtectedRoute from '../components/doctor/protectedRoute';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import KycProtectedRoute from '../components/doctor/kycProtectedRoute';
import Appointments from '../pages/doctor/Appointments';
import MyProfile from '../pages/doctor/MyProfile';
import ManageTokens from '../pages/doctor/ManageTokens';
import History from '../pages/doctor/History';
import Reviews from '../pages/doctor/Reviews';
import ChatHome from '../pages/patient/ChatHome';

const DoctorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route element={<KycProtectedRoute />}>
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/manage-token" element={<ManageTokens />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/chatHome" element={<ChatHome />} />
        {/* <Route path="/verify" element={<Verify />} /> */}
      </Route>

      <Route path="/verify" element={
        <ProtectedRoute>
          <Verify />
        </ProtectedRoute>} />
    </Routes>
  );
};

export default DoctorRoutes;
