import React from 'react';
import backgroundImage from '../assets/bg.png'
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const navigate = useNavigate()
    const handleDoctorClick = ()=>{
        navigate('/doctor/signup')
    }
    const handlePatientClick = ()=>{
        navigate('/patient/signup')
    }
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="relative w-96"> 
                <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" /> 
                <input type="text"
                    value="DocMate"
                    className="w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold" readOnly />
            </div>
            <div className='p-10 flex justify-center'>
                <p className='text-white text-lg text-center w'>DocMate is a digital platform for Doctors and their patients. <br />
                    Patients can find doctors by searching their location, so that they can find the doctors nearby. <br />
                    Doctor will add prescription for the patients, Patients can also access the prescription from their account.</p>
            </div>
            <div>
                <button onClick={handlePatientClick} className='bg-white py-1 pl-6 pr-6 rounded-full text- m-2'>PATIENT</button>
                <button onClick={handleDoctorClick} className='bg-white py-1 pl-6 pr-6 rounded-full text- m-2'>DOCTOR</button>
            </div>
        </div>
    );
};

export default LandingPage;
