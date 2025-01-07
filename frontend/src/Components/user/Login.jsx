import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, loginSuccess, setError } from '../../redux/features/userSlice.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); 

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post('http://localhost:3000/api/user/login', data);
      
      if (response.data.user && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Dispatch login success with user data and token
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token,
        }));
        
        // Show success toast with login time
        
        toast.success(`Welcome back!`);
        navigate('/user/profile');
      } else {
        dispatch(setError('Invalid response from server'));
        toast.error('Invalid response from server');
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/user/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
