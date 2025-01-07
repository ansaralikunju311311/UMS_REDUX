import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const { isAuthenticated: isAdminAuthenticated } = useSelector((state) => state.admin);
    const adminToken = localStorage.getItem('adminToken');

    // If admin is logged in, redirect to admin dashboard
    if (adminToken && isAdminAuthenticated) {
        return <Navigate to="/admin/dashboard" />;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/user/login" />;
    }

    return children;
};

export default AuthProtectedRoute;