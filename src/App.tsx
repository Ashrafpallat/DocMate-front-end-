import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Singup from './pages/doctor/Singup';
import Login from './pages/doctor/Login';
import PatientSingup from './pages/patient/Signup';
import PatientLogin from './pages/patient/PatientLogin';
import Verify from './pages/doctor/Verify';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/protectedRoute';
import PatientProtectedRoute from './components/patientProtectedRoute';
import PatientHome from './pages/patient/PatientHome';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/doctor/signup" element={<Singup />} />
          <Route path="/doctor/login" element={<Login />} />
          <Route path="/patient/signup" element={<PatientSingup />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          
          <Route path="/patient/home" element={
            <PatientProtectedRoute>
              <PatientHome />
            </PatientProtectedRoute>
          } />
          <Route path="/doctor/verify" element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000} // Duration in milliseconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

    </Router>
  );
};

export default App;
