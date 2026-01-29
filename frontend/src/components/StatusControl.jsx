import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, Ban } from 'lucide-react';
import { cn } from '../utils/utils';

const STATUS_OPTIONS = [
    { value: 'green', label: 'Operational', color: 'bg-green-500', icon: CheckCircle2, description: 'System is fully operational' },
    { value: 'yellow', label: 'Warning', color: 'bg-yellow-500', icon: AlertTriangle, description: 'Low stock warnings active' },
    { value: 'blue', label: 'Info', color: 'bg-blue-500', icon: Info, description: 'Read-only mode' },
    { value: 'red', label: 'Critical', color: 'bg-red-500', icon: Ban, description: 'System restricted' },
];

const StatusControl = ({ defaultStatus = 'green', onChange }) => {
    // Local state only - no backend persistence
    const [selectedStatus, setSelectedStatus] = useState(defaultStatus);

    const handleSelect = (statusValue) => {
        setSelectedStatus(statusValue);
        if (onChange) {
            onChange(statusValue);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">System Status</label>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
                {STATUS_OPTIONS.map((option) => {
                    const isActive = selectedStatus === option.value;
                    const Icon = option.icon;

                    return (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                                "relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800",
                                isActive ? "scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 shadow-md" : "hover:scale-105 opacity-60 hover:opacity-100",
                                option.value === 'green' && isActive && "ring-green-500 bg-green-500 text-white",
                                option.value === 'yellow' && isActive && "ring-yellow-500 bg-yellow-500 text-white",
                                option.value === 'blue' && isActive && "ring-blue-500 bg-blue-500 text-white",
                                option.value === 'red' && isActive && "ring-red-500 bg-red-500 text-white",
                                !isActive && option.color.replace('bg-', 'bg-').replace('500', '100') + " text-gray-400"
                            )}
                            title={option.description}
                            type="button"
                        >
                            {!isActive && <div className={cn("w-3 h-3 rounded-full", option.color)} />}
                            {isActive && <Icon size={16} strokeWidth={2.5} />}

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {option.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-gray-400 ml-1">
                {STATUS_OPTIONS.find(o => o.value === selectedStatus)?.description}
            </p>
        </div>
    );
};

export default StatusControl;
