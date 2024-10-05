import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';

const ProtectedRoute = () => {
    const isLoggedIn = useSelector((state: RootState) => state.patient.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/patient/login" />;
    }

    return <Outlet />; // Renders the child routes when logged in
};

export default ProtectedRoute;
