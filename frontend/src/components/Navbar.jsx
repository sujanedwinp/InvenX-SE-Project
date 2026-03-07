import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Package, LayoutDashboard, UserCircle } from 'lucide-react';
import { logout } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const dbName = (user?.dbid || 'DATABASE').toUpperCase();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Inventory', path: '/inventory', icon: <Package size={18} /> },
        { name: 'Profile', path: '/profile', icon: <UserCircle size={18} /> },
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="bg-indigo-600 p-0.5 rounded-lg">
                                <img src="/logo-no-bg.png" alt="Logo Image" className="h-10 w-10 object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                InvenX
                            </span>
                        </div>

                        {/* Dashboard Links */}
                        <div className="hidden md:flex md:ml-8 md:space-x-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end mr-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Database</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-200 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                                {dbName}
                            </span>
                        </div>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-800 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                            <span className="hidden lg:inline">Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 px-3">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Database:</span>
                                <span className="font-mono text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {dbName}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
