import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setUser } from '../../redux/features/userSlice.js';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, token } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    image: '',
    phonenumber: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username,
        email: user.email,
        image: user.image,
        phonenumber: user.phonenumber
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/user/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/user/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/user/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/user/login');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'testing');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dliraelbo/image/upload',
        formData
      );
      setEditData(prev => ({ ...prev, image: response.data.url }));
      setNewImage(response.data.url);
    } catch (error) {
      console.error('Image upload Error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        'http://localhost:3000/api/user/update',
        {
          username: editData.username,
          email: editData.email,
          phonenumber: editData.phonenumber,
          image: editData.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      dispatch(setUser(response.data.user));
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-lg text-gray-600">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
      
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          
          <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition duration-200 flex items-center space-x-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
            <h1 className="text-4xl font-bold text-white mt-600 mb-4 text-center">Welcome! {user.username}</h1>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={isEditing ? editData.image || user.image : user.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2 cursor-pointer hover:bg-indigo-600 transition-colors shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-20 pb-8 px-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={editData.phonenumber}
                    onChange={(e) => setEditData(prev => ({ ...prev, phonenumber: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={updateLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 shadow-md"
                  >
                    {updateLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        phonenumber: user.phonenumber
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-gray-500 mt-2">{user.email}</p>
                  <p className="text-gray-500 mt-2">Phone: {user.phonenumber}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 text-red-600 py-3 px-4 rounded-lg hover:bg-red-500/20 transition duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
