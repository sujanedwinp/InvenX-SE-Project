import React, { useEffect, useState, useMemo } from 'react';
import { getToken } from '../utils/auth';
import { listInventory } from '../services/inventory';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Package, AlertTriangle, Layers, UserCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusControl from '../components/StatusControl';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();

                // Fetch User
                const userRes = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!userRes.ok) throw new Error('Auth failed');
                const userData = await userRes.json();
                setUser(userData.user);

                // Fetch Inventory for stats
                const invData = await listInventory();
                setInventory(invData.items || []);

            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                // logout(); // Optional: might be too aggressive if only inventory fails
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived Stats
    const stats = useMemo(() => {
        const totalItems = inventory.length;
        const totalQuantity = inventory.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
        const lowStock = inventory.filter(i => (parseInt(i.quantity) || 0) < 10).length; // Assumption: < 10 is low
        const categories = [...new Set(inventory.map(i => i.category || 'Uncategorized'))].length;

        return { totalItems, totalQuantity, lowStock, categories };
    }, [inventory]);

    // Chart Data
    const chartData = useMemo(() => {
        const catMap = {};
        inventory.forEach(item => {
            const cat = item.category || 'Other';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });

        return Object.entries(catMap).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'];

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Items"
                    value={stats.totalItems}
                    icon={Package}
                    color="indigo"
                />
                <StatCard
                    title="Total Stock"
                    value={stats.totalQuantity}
                    icon={Layers}
                    color="blue"
                />
                <StatCard
                    title="Low Stock"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                    color={stats.lowStock > 0 ? "red" : "green"}
                    trend={stats.lowStock > 0 ? "up" : "down"}
                    trendValue={stats.lowStock} // Placeholder logic
                />
                <StatCard
                    title="Categories"
                    value={stats.categories}
                    icon={Layers}
                    color="orange"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Inventory Distribution</h2>
                    <div className="h-80">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No inventory data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Panel */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                            <UserCircle size={32} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Database Info</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">ID</span>
                                <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-200">{user?.dbid}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    Connected
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <StatusControl />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
