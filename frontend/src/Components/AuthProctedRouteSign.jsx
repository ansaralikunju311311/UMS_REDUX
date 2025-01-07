import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../redux/features/userSlice';

const AuthProtectedRouteSign = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { isAuthenticated: isAdminAuthenticated } = useSelector((state) => state.admin);

    useEffect(() => {
        const verifyExistingUser = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken && !isAuthenticated) {
                try {
                    const response = await axios.get('http://localhost:3000/api/user/verify', {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
                    if (response.data.user) {
                        dispatch(loginSuccess({
                            user: response.data.user,
                            token: storedToken
                        }));
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
        };

        verifyExistingUser();
    }, [dispatch, isAuthenticated]);

    // If admin is logged in, redirect to admin dashboard
    if (isAdminAuthenticated) {
        return <Navigate to="/admin/dashboard" />;
    }

    // Handle user authentication
    if (isAuthenticated) {
        // Special case: After signup, allow redirect to login
        if (location.pathname === '/user/signup' && location.state?.fromSignup) {
            return <Navigate to="/user/login" />;
        }
        // Otherwise, redirect to profile
        return <Navigate to="/user/profile" />;
    }

    return children;
};

export default AuthProtectedRouteSign;