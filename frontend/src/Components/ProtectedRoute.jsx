import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, setError, setLoading } from '../redux/features/userSlice';
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, isAuthenticated, loading } = useSelector((state) => state.user);
  console.log('log 0')
    useEffect(() => {
          console.log('sublog')
        const verifyToken = async () => {

           
            const storedToken = localStorage.getItem('token');
            console.log("Log 1")
            
            if (!storedToken) {
                localStorage.removeItem('token'); // Clear any invalid token
                navigate('/user/login');
                return;
            }
            console.log('fkkkffkfkgkfmgkfgmfkgg')
            try {
                console.log("Log 2")
                dispatch(setLoading(true));
                const response = await axios.get('http://localhost:3000/api/user/verify', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                console.log("Log 3")

                if (response.data.user) {
                    console.log(response.data.user,"=======response");
                    dispatch(loginSuccess({
                        user: response.data.user,
                        token: storedToken
                    }));
                }
                console.log("Log 4")
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('token'); // Clear invalid token
                dispatch(setError('Session expired. Please login again.'));
                navigate('/user/login');
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (!isAuthenticated) {
            verifyToken();
        }
    }, [dispatch, navigate, isAuthenticated]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }
     console.log('last one')
    return children;
};

export default ProtectedRoute;
