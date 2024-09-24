import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from '../pages/doctor/Singup';
import Login from '../pages/doctor/Login';
import Verify from '../pages/doctor/Verify';
import ProtectedRoute from '../components/protectedRoute';

const DoctorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={
        <ProtectedRoute>
          <Verify />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default DoctorRoutes;
