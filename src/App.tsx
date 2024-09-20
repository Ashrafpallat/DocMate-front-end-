import React from 'react'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Singup from './components/doctor/Singup';
import Login from './components/doctor/Login';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor/signup" element={<Singup />} />
        <Route path="/doctor/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
