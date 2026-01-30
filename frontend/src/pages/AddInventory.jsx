import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createInventoryItem } from '../services/inventory'; 
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddInventory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        minQty: 0,
        maxPrice: 0
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('invenx_token');
            if (!token) throw new Error("No token");

            // Construct payload matching backend expectation (see inventoryService.js)
            const payload = {
                name: formData.name,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                alerts: {
                    minQty: Number(formData.minQty),
                    maxPrice: Number(formData.maxPrice),
                    enabled: true // Enable alerts by default if values are set
                }
                // Note: 'category' is NOT sent because backend schema does not support it
            };

            const response = await fetch('http://localhost:5000/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/inventory');
            } else {
                alert("Failed to create item");
            }

        } catch (err) {
            console.error(err);
            alert("Error creating item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link to="/inventory" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Item</h1>
                    <p className="text-sm text-gray-500">Enter the details and alert thresholds for the new item.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3 border"
                                placeholder="Laptop, Chair, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3 border"
                            />
                        </div>

                        {/* New Alert Fields */}
                        <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Inventory Alerts</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Quantity (Low Stock)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="minQty"
                                            min="0"
                                            value={formData.minQty}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3 border"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">units</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Alert when stock falls below this.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price (Cost Alert)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            min="0"
                                            step="0.01"
                                            value={formData.maxPrice}
                                            onChange={handleChange}
                                            className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm py-2 px-3 border"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Alert when price exceeds this.</p>
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            {/* Category kept for display but seemingly unsupported by backend */}
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category (Unsupported by DB)</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 sm:text-sm py-2 px-3 border cursor-not-allowed"
                            >
                                <option value="">Category saving not enabled in database</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Link
                            to="/inventory"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                        >
                            <Save size={16} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventory;
