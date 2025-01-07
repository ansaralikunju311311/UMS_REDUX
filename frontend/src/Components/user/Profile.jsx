import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/userSlice.js';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, token } = useSelector((state) => state.user);
  // console.log(user);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/user/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await axios.post('http://localhost:3000/api/user/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Dispatch logout action
      dispatch(logout());
      
      navigate('/user/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server call fails, we should still logout locally
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/user/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Profile</h2>
                <div className="mb-4">
                  <p className="font-semibold">Username:</p>
                  <p>{user.username}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold">Email:</p>
                  <p>{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
