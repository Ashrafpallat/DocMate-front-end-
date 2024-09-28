import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/patientSlice';
import axios from 'axios';


const Verify = () => {

  const dispatch = useDispatch()
  const { name, email } = useSelector((state: RootState) => state.patient);
  const handleLogout = async () => {
    try {
      console.log('loguot api sending..');

    await axios.post('http://localhost:5000/api/patient/logout', {}, { withCredentials: true });

      console.log('api reutuned');

      dispatch(logout());
    } catch (error) {
      console.error('Error during logout', error);
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="mb-4">Name: {name}</p>
      <p className="mb-4">Email: {email}</p>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>

  )
}

export default Verify
