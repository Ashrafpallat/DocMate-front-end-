// ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); 

    if (!isLoggedIn) {
        return <Navigate to="/doctor/login" />;
    }

    return children;
};

export default ProtectedRoute;
