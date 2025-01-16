import React, { useEffect, useRef, useState } from 'react'
import backgroundImage from '../../assets/bg.png'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../firebaseConfig'; // Adjust the path accordingly
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/doctorSlice';
import { FcGoogle } from 'react-icons/fc';
import { Loader } from "@googlemaps/js-api-loader";
import toast from 'react-hot-toast';
import { doctorSignup, googleAuthApi } from '../../services/doctorServices';
import { DoctorSignupData } from '../../Interfaces/doctorSignupInterface';



const Singup: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<DoctorSignupData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        locationName: '',
        latitude: '',
        longitude: '',
        specialization: '',
        experience: '',
        gender: ''
    });

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,  // Access the API key from Vite's env variables
            libraries: ["places"],
        });

        loader.load().then(() => {
            if (inputRef.current) {
                const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                    types: ["geocode"],
                });

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        const latitude = place.geometry.location?.lng()
                        const longitude = place.geometry.location?.lng();
                        setFormData((prevDetails) => ({
                            ...prevDetails,  // Spread previous details to ensure you don't lose any data
                            locationName: place.formatted_address || '',
                            latitude: latitude?.toString() || '',
                            longitude: longitude?.toString() || '',
                        }));
                    }
                });
            }
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value,
        })
    }
    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Valid email is required");
            return false;
        }
        if (!formData.locationName.trim()) {
            toast.error("Location is required");
            return false;
        }
        if (!formData.specialization.trim()) {
            toast.error("Specialization is required");
            return false;
        }
        if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
            toast.error("Experience must be a positive number");
            return false;
        }
        if (!formData.gender) {
            toast.error("Please select your gender");
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try {
            console.log('sendin req');

            // const response = await api.post('/doctor/signup', formData)
            const response = await doctorSignup(formData)
            toast.success('successs', response?.data.message); // SUCCESS MESSAGE
            navigate('/doctor/login')
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
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                const name = user.displayName || 'fallback name';
                const email = user.email || 'fallback email'
                const data = await googleAuthApi(name, email)
                const doctorName = data.name
                const doctorEmail = data.email
                const kycVerified = data.kycVerified
                const profilePhoto = data.profilePhoto
                // Store user info in Redux
                dispatch(login({ name: doctorName, email: doctorEmail, kycVerified, profilePhoto: profilePhoto }));

                toast.success(`Welcome ${name}`);
                navigate('/doctor/verify'); // Redirect to desired page
            }
        } catch (error) {
            toast.error('Google sign-in failed');
            console.error('Error signing in with Google', error);
        }
    };
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center flex-col" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div onClick={() => navigate('/')} className="relative w-96 mb-10">
                <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
                <input type="text"
                    value="DocMate"
                    className="cursor-pointer w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold" readOnly />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
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
                        ref={inputRef}
                        type="text"
                        name="locationName"
                        placeholder="Location"
                        value={formData.locationName}
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
                        name="specialization"
                        placeholder="Specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="experience"
                        placeholder="Experience"
                        value={formData.experience}
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
                <div className="flex justify-center">
                    <button type='submit' className="bg-white text-lg py-3 sm:px-60 px-48 rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                        Sign Up
                    </button>
                </div>
                <div className="bg-white text-lg py-3 flex justify-center rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
                    <button onClick={handleGoogleAuth} className="flex items-center space-x-3" ><FcGoogle size={24} /> <span>Continue With Google</span>  </button>
                </div>
                <div className='flex justify-center'>
                    <Link to={'/doctor/login'}> <p className='text-white hover:underline'>Already have an account? Log In</p></Link>
                </div>
            </form>
        </div>
    )
}

export default Singup
