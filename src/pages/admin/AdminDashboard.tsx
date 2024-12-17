import {  useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AdminLayout from '../../components/admin/AdminLayout';


const Verify = () => {
  const { name, email } = useSelector((state: RootState) => state.admin);
  return (
    <AdminLayout>
      <div>
        <p className="mb-4">Name: {name}</p>
        <p className="mb-4">Email: {email}</p>
        
      </div>
    </AdminLayout>

  )
}

export default Verify
