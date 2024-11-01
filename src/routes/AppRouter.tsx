import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import PatientRoutes from './PatientRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';
import Test from '../components/Test'

const AppRouter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    let title = 'DocMate';
    if (location.pathname.startsWith('/patient')) {
      title = 'DocMate - Patient';
    } else if (location.pathname.startsWith('/doctor')) {
      title = 'DocMate - Doctor';
    } else if (location.pathname.startsWith('/admin')) {
      title = 'DocMate - Admin';
    }

    document.title = title;
  }, [location]);
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
