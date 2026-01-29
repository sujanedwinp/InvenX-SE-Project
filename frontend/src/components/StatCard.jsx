import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, trendValue, color = "indigo" }) => {
    const Icon = icon;
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <span
                        className={`text-sm font-medium flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {trend === 'up' ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                        {trendValue}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
