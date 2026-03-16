import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        dbid: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ dbid: formData.dbid, password: formData.password });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Welcome back"
            subtitle={<span>Or <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">create a new account</Link></span>}
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400" role="alert">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="dbId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        DB ID
                    </label>
                    <div className="mt-2">
                        <input
                            id="dbId"
                            name="dbid"
                            type="text"
                            required
                            value={formData.dbid}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:ring-gray-600 dark:text-white"
                            placeholder="Enter your DB Name"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:ring-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
