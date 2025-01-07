import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthProtectedDash = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.admin);
    const adminToken = localStorage.getItem('adminToken');

    useEffect(() => {
        if (adminToken && isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [adminToken, isAuthenticated, navigate]);

    if (adminToken && isAuthenticated) {
        return null;
    }

    return children;
};

export default AuthProtectedDash;