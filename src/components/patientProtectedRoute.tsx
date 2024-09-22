// ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useSelector((state: RootState) => state.patient.isLoggedIn); 

    if (!isLoggedIn) {
        return <Navigate to="/patient/login" />;
    }

    return children;
};

export default ProtectedRoute;
