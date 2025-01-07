import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading, loginSuccess, setError } from '../../redux/features/adminSlice';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post('http://localhost:3000/api/admin/login', data);
      
      if (response.data.admin && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        dispatch(loginSuccess({
          admin: response.data.admin,
          token: response.data.token
        }));
        
        // Show success toast with login time
        
        toast.success(`Admin logged in successfully`);
        navigate('/admin/dashboard');
      } else {
        dispatch(setError('Invalid response from server'));
        toast.error('Invalid response from server');
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Admin login failed. Please check your credentials.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
           <div className="mb-4">
            <label>Username</label>
            <input placeholder='admin'
            className="w-full p-2 border rounded mt-1"
            type="text"
            {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
           </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
