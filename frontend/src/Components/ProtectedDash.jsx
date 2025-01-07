import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loadAdminSuccess, loadAdminFail } from '../redux/features/adminSlice';
import { setError, setLoading } from '../redux/features/userSlice';

const ProtectedDash = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.admin);
    const adminToken = localStorage.getItem('adminToken');

    useEffect(() => {
        const verifyToken = async () => {
            if (!adminToken) {
                navigate('/admin/login');
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                };
                const response = await axios.get('http://localhost:3000/api/admin/verify', config);
                dispatch(loadAdminSuccess(response.data.admin));
            } catch (error) {
                console.error('Token verification failed:', error);
                dispatch(loadAdminFail());
                navigate('/admin/login');
            }
        };

        verifyToken();
    }, [adminToken, navigate, dispatch]);

    if (!isAuthenticated) {
        return null;
    }

    return children;
};

export default ProtectedDash;