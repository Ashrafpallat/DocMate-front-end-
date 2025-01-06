import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const KycProtectedRoute = () => {
    const KycVerified = useSelector((state: RootState) => state.doctor.KycVerified);
    const isLoggedIn = useSelector((state: RootState) => state.doctor.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/doctor/login" />;
    }

    if (!KycVerified) {
        toast('Verify You Account First', {icon: '⚠️'})
        return <Navigate to="/doctor/verify" />;
    }

    return <Outlet />; // This will render child components/routes
};

export default KycProtectedRoute;
