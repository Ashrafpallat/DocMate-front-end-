import React, { useState } from 'react'
import backgroundImage from '../../assets/bg.png'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../firebaseConfig'; // Adjust the path accordingly
import { signInWithPopup } from 'firebase/auth';
import { login } from '../../redux/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';


interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    location: string;
    age: string;
    gender: string;
}

const Singup: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.patient.isLoggedIn);
    React.useEffect(() => {
        if (isLoggedIn) {
          navigate('/patient/home'); 
        }
      }, [isLoggedIn, navigate]);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        age: '',
        gender: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value,
        })
    }
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Helper function to check if any field is empty
    const isEmptyField = () => {
        return Object.values(formData).some((field) => field === '');
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isEmptyField()) {
            toast.error('All fields are required');
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid email');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!['Male', 'Female'].includes(formData.gender)) {
            toast.error('Please select a gender');
            return;
        }
        try {
            console.log('sendin req');

            const response = await axios.post('http://localhost:5000/api/patient/signup', formData)
            toast.success('Account created, Login Now', response.data.message); // SUCCESS MESSAGE
            navigate('/patient/login')
        } catch (error: any) {

            if (error.response) {
                toast.error(error.response.data.message); // The actual error message from the server
            } else if (error.request) {
                toast.error('No response received', error.request);
            } else {
                toast.error('Error', error.message);
            }
        }
    }
    const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
    
          if (user) {
            const name = user.displayName || 'fallback name';
            const email = user.email || 'fallback email'
            const profilePhoto = user.photoURL || ''
            await axios.post('http://localhost:5000/api/patient/google-auth', {name, email})
            // Store user info in Redux
            dispatch(login({ name, email, profilePhoto }));
            toast.success(`Welcome ${name}`);
            navigate('/patient/home'); // Redirect to desired page
          }
        } catch (error) {
            toast.error('Google sign-in failed');
            if (axios.isAxiosError(error)) {
              console.error('Axios error:', error.response?.data);
            } else {
              console.error('Unexpected error:', error);
            }
        }
      };
          
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div onClick={() => navigate('/')} className="relative w-96 mb-10">
                <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
                <input type="text"
                    value="DocMate"
                    className="w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold" readOnly />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex justify-center space-x-4">

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="flex items-center text-white space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                                className="form-radio ml-14 text-blue-500"
                            />
                            <span>Male</span>
                        </label>
                        <label className="flex items-center text-white space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                                className="form-radio text-blue-500"
                            />
                            <span>Female</span>
                        </label>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-col justify-center">
                    <button type='submit' className="bg-white text-lg py-3 px-60 rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                        Sign Up
                    </button>

                </div>
                <div className="bg-white text-lg py-3 flex justify-center rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                <button onClick={handleGoogleSignIn} className="flex items-center space-x-3" ><FcGoogle size={24}/> <span>Continue With Google</span>  </button>
                </div>
                <div className='flex justify-center'>
                    <Link to={'/patient/login'}> <p className='text-white hover:underline'>Already have an account? Log In</p></Link>
                </div>
            </form>
        </div>
    )
}

export default Singup
