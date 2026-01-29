import { Link, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">InvenX</h1>
            <p className="text-xl text-gray-600 mb-8">Internal Inventory Management System</p>
            <div className="space-x-4">
                <Link
                    to="/login"
                    className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="px-6 py-3 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;
