import React, { useEffect, useState, useMemo } from 'react';
import { listInventory, deleteInventoryItem } from '../services/inventory';
import { Search, Plus, Trash2, Edit, AlertCircle, PackageX, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function getStatus(item) {
    const enabled = item.alerts?.enabled === true;
    const low = enabled && item.quantity < (item.alerts?.minQty ?? 0);
    const price = enabled && (item.alerts?.maxPrice ?? 0) > 0 && item.price > item.alerts.maxPrice;
    if (low && price) return 'LOW_PRICE';
    if (low) return 'LOW';
    if (price) return 'PRICE';
    return 'OK';
}

const STATUS_CONFIG = {
    LOW_PRICE: { label: 'Low + Price Alert', cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    LOW: { label: 'Low Stock', cls: 'bg-red-100    text-red-800    dark:bg-red-900/30    dark:text-red-400' },
    PRICE: { label: 'Price Hike', cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    OK: { label: 'In Stock', cls: 'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-400' },
};

const StatusBadge = ({ item }) => {
    const { label, cls } = STATUS_CONFIG[getStatus(item)];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {getStatus(item) !== 'OK' && <AlertCircle size={12} />}
            {label}
        </span>
    );
};

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await listInventory();
            setItems(data.items || []);
        } catch (err) {
            console.error("Failed to load inventory", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(q.toLowerCase())
        );
    }, [items, q]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteInventoryItem(id);
                fetchInventory();
            } catch (err) {
                console.error(err);
                alert("Failed to delete item");
            }
        }
    };

    const handleEdit = (item) => {
        navigate('/add-inventory', {
            state: {
                id: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                minQty: item.alerts?.minQty ?? 0,
                maxPrice: item.alerts?.maxPrice ?? 0,
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>

                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search items..."
                        className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>

                <Link
                    to="/add-inventory"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={18} />
                    Add Item
                </Link>

            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <PackageX size={48} className="text-gray-300" />
                                            <p>No items found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                    <Package size={20} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-l font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge item={item} />
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            Rs. {Number(item.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            Rs. {(item.quantity * item.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
