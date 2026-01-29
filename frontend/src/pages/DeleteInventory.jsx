import React, { useEffect, useState } from 'react';
import { listInventory, deleteInventoryItem } from '../services/inventory';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeleteInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await listInventory();
            setItems(data.items || []);
        } catch (err) {
            console.error("Failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`DANGER: Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            try {
                await deleteInventoryItem(id);
                fetchInventory();
            } catch (err) {
                console.error(err);
                alert("Failed to delete item");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-r-lg">
                <div>
                    <h1 className="text-2xl font-bold text-red-700 dark:text-red-400">Delete Inventory</h1>
                    <p className="text-sm text-red-600 dark:text-red-300">Restricted Area - Remove items from database</p>
                </div>
                <Link
                    to="/inventory"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Safety
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-red-50 dark:bg-red-900/20">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider">Item Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider">Qty</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Delete</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : items.map((item) => (
                                <tr key={item._id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(item._id, item.name)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 opacity-60 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider">Delete</span>
                                                <Trash2 size={18} />
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeleteInventory;
