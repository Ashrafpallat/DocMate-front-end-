import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PatientSignup from '../pages/patient/Signup';
import PatientLogin from '../pages/patient/PatientLogin';
import PatientHome from '../pages/patient/PatientHome';
import PatientProtectedRoute from '../components/patient/patientProtectedRoute';
import PatientProfile from '../pages/patient/PatientProfile';
import DoctorsNearby from '../pages/patient/DoctorsNearby';
import ViewSlotes from '../pages/patient/ViewSlotes';

const PatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<PatientSignup />} />
      <Route path="/login" element={<PatientLogin />} />

      <Route element={<PatientProtectedRoute />}>
        <Route path="/home" element={<PatientHome />} />
        <Route path="/doctors-nearby" element={<DoctorsNearby />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/view-slotes" element={<ViewSlotes />} />
      </Route>
    </Routes>

  );
};

export default PatientRoutes;
