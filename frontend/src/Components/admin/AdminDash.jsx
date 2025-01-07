import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/adminSlice';

const AdminDash = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.admin);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    if (!admin) {
        return <div>Loading...</div>;
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
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Content</h2>
                        {/* Add your dashboard content here */}
                        <p className="text-gray-600">Welcome to your admin dashboard. This is where you can manage your application.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDash;
