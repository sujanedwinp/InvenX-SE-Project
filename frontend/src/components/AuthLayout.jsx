import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center gap-2 mb-6 group">
                    <div className="bg-indigo-600 p-2 rounded-xl transition-transform group-hover:scale-110">
                        <Database className="h-8 w-8 text-white" />
                    </div>
                </Link>
                <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-xl sm:px-10 border border-gray-100 dark:border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
