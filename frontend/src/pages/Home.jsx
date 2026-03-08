import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, Zap, ArrowRight, BarChart3 } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14 dark:from-indigo-900/20">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16 pt-2">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-300 dark:ring-white/10 dark:hover:ring-white/20">
                                InvenX{" "}
                                <a
                                    href="https://github.com/sujanedwinp/InvenX-SE-Project"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-indigo-600 dark:text-indigo-400"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                            Inventory management for the modern era
                        </h1>
                        <p className="mt-3 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Streamlining inventory management through stock tracking and visual charts.
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-x-6">
                            <Link
                                to="/login"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                            >
                                Get started
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-1"
                            >
                                Create account <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-y-8 gap-x-8 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4 text-blue-600 dark:text-blue-400">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Tracking</h3>
                        <p className="text-gray-500 dark:text-gray-400">Stock tracking with Dashboard.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4 text-purple-600 dark:text-purple-400">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
                        <p className="text-gray-500 dark:text-gray-400">Login with password to access your Inventory.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4 text-green-600 dark:text-green-400">
                            <BarChart3 size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Insights</h3>
                        <p className="text-gray-500 dark:text-gray-400">Visual Charts to easily understand inventory levels</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-8 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-gray-800">
                <p>&copy; {new Date().getFullYear()} InvenX System. All rights reserved.</p>
                <p>A Software Engineering Project.</p>
            </footer>
        </div>
    );
};

export default Home;
