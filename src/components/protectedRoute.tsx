// ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useSelector((state: RootState) => state.doctor.isLoggedIn); 

    if (!isLoggedIn) {
        return <Navigate to="/doctor/login" />;
    }

    return children;
};

export default ProtectedRoute;
