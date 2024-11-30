// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = () => {
    const { isLogin } = useAuth();

    return isLogin ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
