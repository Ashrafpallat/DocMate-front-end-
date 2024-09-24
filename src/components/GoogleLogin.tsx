import React from 'react';
import { auth, googleProvider } from '../firebaseConfig'; // Adjust the path accordingly
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/patientSlice';

const GoogleLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const name = user.displayName || 'fallback name';
        const email = user.email || 'fallback email'

        // Store user info in Redux
        dispatch(login({ name, email }));

        toast.success(`Welcome ${name}`);
        navigate('/patient/home'); // Redirect to desired page
      }
    } catch (error) {
      toast.error('Google sign-in failed');
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Continue With Google</button>
    </div>
  );
};

export default GoogleLogin;
