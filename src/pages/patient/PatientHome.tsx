import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/patientSlice';


const Verify = () => {
  const dispatch = useDispatch()
  const { name, email } = useSelector((state: RootState) => state.patient);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="mb-4">Name: {name}</p>
      <p className="mb-4">Email: {email}</p>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>

  )
}

export default Verify
