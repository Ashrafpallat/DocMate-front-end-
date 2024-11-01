import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import backgroundImage from '../../assets/bg.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/doctorSlice'
import { RootState } from '../../redux/store'
import { auth, googleProvider } from '../../firebaseConfig'; 
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import api from '../../services/axiosInstance'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.doctor.isLoggedIn);
    const kycVerified = useSelector((state: RootState) => state.doctor.KycVerified);

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/doctor/verify');
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/doctor/login', { email, password });
            const userInfo = response.data.doctor
            handleLoginSuccess(userInfo)
        } catch (error) {
            console.log('Incorrect Email or Password');
            toast.error('Incorrect Email or Password');
        }
    };
    const handleLoginSuccess = (userInfo: { name: string; email: string; kycVerified: boolean; profilePhoto: string }) => {
        dispatch(login({ name: userInfo.name, email: userInfo.email, kycVerified: userInfo.kycVerified, profilePhoto: userInfo.profilePhoto || '' }));
        console.log('login success');
        toast.success(`Welcome ${userInfo.name}`);
        if (kycVerified) {
            navigate('/doctor/dashboard');
        } else {
            navigate('/doctor/verify');
        }
    };
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                const name = user.displayName || 'fallback name';
                const email = user.email || 'fallback email'
                const response = await axios.post('http://localhost:5000/api/doctor/google-auth', { name, email })

                const userInfo = response.data.doctor
                handleLoginSuccess(userInfo)
            }
        } catch (error) {
            toast.error('Google sign-in failed');
            console.error('Error signing in with Google', error);
        }
    };
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {/* <ToastContainer/> */}
            <div onClick={() => navigate('/')} className="relative w-96 mb-10">
                <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
                <input type="text"
                    value="DocMate"
                    className="w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold" readOnly />
            </div>
            <form onSubmit={handleLogin} className=''>
                <div className='space-y-4'>
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full py-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full py-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-center mt-7">
                    <button type='submit' className=" bg-white text-lg py-3 px-60 rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                        Log In
                    </button>
                </div>
                <div className="bg-white text-lg py-3 flex justify-center rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                    <button onClick={handleGoogleAuth} className="flex items-center space-x-3" ><FcGoogle size={24} /> <span>Continue With Google</span>  </button>
                </div>
                <div className='flex justify-center mt-1'>
                    <Link to={'/doctor/signup'}> <p className='text-white hover:underline'>Don't have an account? Sign Up</p></Link>
                </div>
            </form>
        </div>
    )
}

export default Login
