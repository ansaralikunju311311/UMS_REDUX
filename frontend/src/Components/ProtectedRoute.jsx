import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, setError, setLoading } from '../redux/features/userSlice';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const { isAuthenticated: isAdminAuthenticated } = useSelector((state) => state.admin);

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('token');
            const adminToken = localStorage.getItem('adminToken');

            // Handle admin authentication first
            if (adminToken && isAdminAuthenticated) {
                navigate('/admin/dashboard');
                return;
            }

            // For user token verification
            if (storedToken) {
                try {
                    dispatch(setLoading(true));
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
                        // If not already on profile page, redirect there
                        if (window.location.pathname !== '/user/profile') {
                            navigate('/user/profile');
                        }
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    dispatch(setError('Session expired. Please login again.'));
                    navigate('/user/login');
                } finally {
                    dispatch(setLoading(false));
                }
            } else {
                navigate('/user/login');
            }
        };

        verifyToken();
    }, [dispatch, navigate, isAdminAuthenticated]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Only render children if user is authenticated
    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
