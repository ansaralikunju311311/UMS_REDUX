import React, { useEffect, useState } from 'react';
// import User from '../../../backend/Model/userModel';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/adminSlice';
import axios from 'axios';

const AdminDash = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.admin);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await axios.get('http://localhost:3000/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data.users);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        if (admin) {
            fetchUsers();
        }
    }, [admin]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (!admin) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl font-semibold">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-600">Welcome, {admin.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h2 className="text-lg font-medium text-gray-900">Registered Users</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img 
                                                            className="h-10 w-10 rounded-full" 
                                                            src={user.image || "https://via.placeholder.com/40"} 
                                                            alt="" 
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDash;
