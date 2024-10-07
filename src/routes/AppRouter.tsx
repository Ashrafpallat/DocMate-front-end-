import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import PatientRoutes from './PatientRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';
import Test from '../components/Test'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Combine all route groups */}
      <Route path="/test" element={<Test />} />
      <Route path="/patient/*" element={<PatientRoutes />} />
      <Route path="/doctor/*" element={<DoctorRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRouter;
