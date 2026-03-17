import React, { useEffect, useState, useMemo, memo } from 'react';
import { fetchDashboardStats } from '../services/inventory';
import { useAuth } from '../context/AuthContext';
import { Package, AlertTriangle, Layers } from 'lucide-react';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


const COLORS = [
    '#6366f1', '#8b5cf6', '#22d3ee', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#3b82f6',
    '#84cc16', '#f97316', '#a78bfa'
];

const CustomTooltip = memo(({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
            <p className="font-semibold text-white">{name}</p>
            <p className="text-gray-400">Stock: <strong className="text-white">{value}</strong></p>
        </div>
    );
});

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (err) {
                console.error('Dashboard fetch failed:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const chartData = useMemo(() => stats?.chartData ?? [], [stats]);
    const roleName = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'User';

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-96 items-center justify-center text-red-400 text-sm">{error}</div>
        );
    }

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Items" value={stats?.totalItems ?? 0} icon={Package} color="indigo" />
                <StatCard title="Total Stock" value={stats?.totalStock ?? 0} icon={Layers} color="blue" />
                <StatCard
                    title="Low Stock"
                    value={stats?.lowStock ?? 0}
                    icon={AlertTriangle}
                    color={(stats?.lowStock ?? 0) > 0 ? 'red' : 'green'}
                    trend={(stats?.lowStock ?? 0) > 0 ? 'down' : 'up'}
                    trendValue={stats?.lowStock ?? 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Inventory Distribution
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                        Quantity per item{chartData.length === 11 ? ' — top 10 shown' : ''}
                    </p>

                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    stroke="none"
                                    startAngle={90}
                                    endAngle={450}
                                    isAnimationActive={true}
                                    animationBegin={0}
                                    animationDuration={900}
                                    animationEasing="ease-in-out"
                                    cornerRadius={5}
                                    minAngle={5}
                                >
                                    {chartData.map((_, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={COLORS[idx % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={CustomTooltip} />
                                <Legend
                                    height={36}
                                    formatter={(value) => (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
                                    )}
                                    iconType='circle'
                                    iconSize={16}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center" style={{ height: 300 }}>
                            <p className="text-gray-400 text-sm">No inventory data available</p>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome back, {user?.name}</h2>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {roleName}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Database Info</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">ID</span>
                                <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-200">{user?.dbid}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    Connected
                                </span>
                            </div>
                        </div>

                        {chartData.length > 0 && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Items</h3>
                                <div className="space-y-2">
                                    {chartData.slice(0, 4).map((item, idx) => (
                                        <div key={item.name} className="flex justify-between text-sm">
                                            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <span
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                />
                                                {item.name}
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
