import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/adminSlice';
import axios from 'axios';

const AdminDash = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { admin } = useSelector((state) => state.admin);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: '',
        phonenumber: ''
    });

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

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            phonenumber: user.phonenumber
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditFormData({
            username: '',
            email: '',
            phonenumber: ''
        });
    };

    const handleSaveEdit = async (userId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(`http://localhost:3000/api/admin/users/${userId}`, editFormData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setUsers(users.map(user => 
                user._id === userId ? response.data.user : user
            ));
            
            setEditingUser(null);
            setEditFormData({
                username: '',
                email: '',
                phonenumber: ''
            });
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            user.username?.toLowerCase().includes(searchTermLower) ||
            user.email?.toLowerCase().includes(searchTermLower) ||
            user.phonenumber?.toLowerCase().includes(searchTermLower)
        );
    });

    if (!admin) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
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
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
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
                                    {filteredUsers.map((user) => (
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
                                                        {editingUser?._id === user._id ? (
                                                            <input
                                                                type="text"
                                                                name="username"
                                                                value={editFormData.username}
                                                                onChange={handleEditFormChange}
                                                                className="text-sm border rounded px-2 py-1"
                                                            />
                                                        ) : (
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.username}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser?._id === user._id ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email}
                                                        onChange={handleEditFormChange}
                                                        className="text-sm border rounded px-2 py-1"
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingUser?._id === user._id ? (
                                                    <input
                                                        type="text"
                                                        name="phonenumber"
                                                        value={editFormData.phonenumber}
                                                        onChange={handleEditFormChange}
                                                        className="text-sm border rounded px-2 py-1"
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-900">{user.phonenumber}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {editingUser?._id === user._id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleSaveEdit(user._id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    No users found matching your search.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDash;
