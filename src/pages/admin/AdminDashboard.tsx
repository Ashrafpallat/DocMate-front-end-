import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/adminSlice';
import AdminLayout from '../../components/admin/AdminLayout';


const Verify = () => {
  const dispatch = useDispatch()
  const { name, email } = useSelector((state: RootState) => state.admin);
  return (
    <AdminLayout>
      <div>
        <p className="mb-4">Name: {name}</p>
        <p className="mb-4">Email: {email}</p>
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </div>
    </AdminLayout>

  )
}

export default Verify
