import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import backgroundImage from "../../assets/bg.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/patientSlice";
import { RootState } from "../../redux/store";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { patientGoogleAutApi, patientLoginApi } from "../../services/patientServices";

const Login = () => {
  const [email, setEmail] = useState("ashraf@gmail.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.patient.isLoggedIn);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/patient/home");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await patientLoginApi(email,password)      
      if(response?.status === 200){
        const userInfo = response?.data.patient;
        handleLoginSuccess(userInfo);
      }
    } catch (error: any) {
        if (error.response && error.response.data.message) {
          toast(error.response.data.message, {icon:'☹️'}); 
        } else {
          toast.error('An unexpected error occurred. Please try again.'); 
        }
    }
  };
  const handleLoginSuccess = (userInfo: { name: string; email: string; profilePhoto: string }) => {
    dispatch(login({ name: userInfo.name, email: userInfo.email, profilePhoto: userInfo.profilePhoto || '' }));
    if (userInfo) {
      navigate("/patient/home");
    }
    toast(`Welcome ${userInfo.name}`,{icon: '😊'});
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const name = user.displayName || "fallback name";
        const email = user.email || "fallback email";
        const profilePhoto = user.photoURL || ''
        await patientGoogleAutApi(name,email)
        // Store user info in Redux
        dispatch(login({ name, email, profilePhoto }));

        toast(`Welcome ${name}`,{icon: '😊'});
        navigate("/patient/home"); // Redirect to desired page
      }
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div onClick={() => navigate("/")} className="relative w-96 mb-10">
        <FaSearch className="absolute top-1/2 left-6 transform -translate-y-1/2 text-gray-500 text-2xl" />
        <input
          type="text"
          value="DocMate"
          className="cursor-pointer w-full py-4 pl-20 pr-4 text-gray-700 text-3xl border border-gray-300 rounded-full font-bold"
          readOnly
        />
      </div>
      <form onSubmit={handleLogin} className="">
        <div className="space-y-4">
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
          <button
            type="submit"
            className=" bg-white text-lg py-3 sm:px-60 px-40 rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100"
          >
            Log In
          </button>
        </div>
        <div className="bg-white text-lg py-3 flex justify-center rounded-full mt-3 font-bold text-gray-700 shadow-md hover:bg-gray-100">
          <button
            onClick={handleGoogleAuth}
            className="flex items-center space-x-3"
          >
            <FcGoogle size={24} /> <span>Continue With Google</span>{" "}
          </button>
        </div>
        <div className="flex justify-center mt-1">
          <Link to={"/patient/signup"}>
            {" "}
            <p className="text-white hover:underline">
              Don't have an account? Sign Up
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
