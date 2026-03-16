import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createInventoryItem, updateInventoryItem } from '../services/inventory';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    validateName,
    validateInteger,
    validatePositiveNumber,
    validateAlertThreshold,
    NAME_MAX_LENGTH,
    NUMERIC_MAX
} from '../utils/validation';

const AddInventory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [itemId, setItemId] = useState(null);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        minQty: 0,
        maxPrice: 0
    });

    useEffect(() => {
        if (location.state) {
            const { id, name, quantity, price, minQty, maxPrice } = location.state;
            setItemId(id || null);
            setFormData({
                name: name || '',
                quantity: quantity ?? '',
                price: price ?? '',
                minQty: minQty ?? 0,
                maxPrice: maxPrice ?? 0,
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name' && value.length > NAME_MAX_LENGTH) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormError('');
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ── Client-side validation ────────────────────────────────────────────────
    const validate = () => {
        const errors = {};

        const nameResult = validateName(formData.name);
        if (!nameResult.valid) errors.name = nameResult.message;

        const qtyResult = validateInteger(formData.quantity, 'Quantity');
        if (!qtyResult.valid) errors.quantity = qtyResult.message;

        const priceResult = validatePositiveNumber(formData.price, 'Price');
        if (!priceResult.valid) errors.price = priceResult.message;

        const minQtyResult = validateAlertThreshold(formData.minQty, 'Min Quantity', true);
        if (!minQtyResult.valid) errors.minQty = minQtyResult.message;

        const maxPriceResult = validateAlertThreshold(formData.maxPrice, 'Max Price', false);
        if (!maxPriceResult.valid) errors.maxPrice = maxPriceResult.message;

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setFormError(Object.values(errors)[0]);
            return;
        }

        setLoading(true);
        setFormError('');
        try {
            const payload = {
                name: formData.name,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                alerts: {
                    minQty: Number(formData.minQty),
                    maxPrice: Number(formData.maxPrice),
                    enabled: Number(formData.minQty) > 0 || Number(formData.maxPrice) > 0
                }
            };

            if (itemId) {
                await updateInventoryItem(itemId, payload);
            } else {
                await createInventoryItem(payload);
            }

            navigate('/inventory');
        } catch (err) {
            console.error(err);
            setFormError(err.message || (itemId ? 'Error updating item' : 'Error creating item'));
        } finally {
            setLoading(false);
        }
    };

    const isEditing = Boolean(itemId);

    const inputClass = (field) =>
        `mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 border appearance-none text-gray-900 ${fieldErrors[field]
            ? 'border-red-400 dark:border-red-500 ring-1 ring-red-400'
            : 'border-gray-300 dark:border-gray-600'
        }`;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link to="/inventory" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Editing Item' : 'Add New Item'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {isEditing
                            ? 'Update the details for this item.'
                            : 'Enter the details and alert thresholds for the new item.'}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {/* ── Form-level error banner ── */}
                {formError && (
                    <div className="flex items-center gap-2 mb-5 p-3 text-sm text-red-700 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400" role="alert">
                        <AlertCircle size={16} />
                        <span>{formError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        {/* ── Item Name ── */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                maxLength={NAME_MAX_LENGTH}
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass('name')}
                                placeholder="Laptop, Chair, etc."
                            />
                            <div className="flex justify-between mt-1">
                                {fieldErrors.name
                                    ? <p className="text-xs text-red-500">{fieldErrors.name}</p>
                                    : <span />}
                                <p className="text-xs text-gray-400">{formData.name.length}/{NAME_MAX_LENGTH}</p>
                            </div>
                        </div>

                        {/* ── Quantity ── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min={1}
                                max={NUMERIC_MAX}
                                step={1}
                                value={formData.quantity}
                                onChange={handleChange}
                                className={inputClass('quantity')}
                            />
                            {fieldErrors.quantity && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.quantity}</p>
                            )}
                        </div>

                        {/* ── Price ── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min={1}
                                max={NUMERIC_MAX}
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className={inputClass('price')}
                            />
                            {fieldErrors.price && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>
                            )}
                        </div>

                        {/* ── Alert Thresholds ── */}
                        <div className="sm:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Inventory Alerts</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                                {/* Min Qty */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Quantity (Low Stock)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="minQty"
                                            min={0}
                                            max={NUMERIC_MAX}
                                            step={1}
                                            value={formData.minQty}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 border ${fieldErrors.minQty ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">units</span>
                                        </div>
                                    </div>
                                    {fieldErrors.minQty
                                        ? <p className="mt-1 text-xs text-red-500">{fieldErrors.minQty}</p>
                                        : <p className="mt-1 text-xs text-gray-500">Alert when stock falls below this. (0 = disabled)</p>}
                                </div>

                                {/* Max Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price (Cost Alert)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Rs.</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            min={0}
                                            max={NUMERIC_MAX}
                                            step="0.01"
                                            value={formData.maxPrice}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 border appearance-none text-gray-900 dark:text-white ${fieldErrors.maxPrice ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                    </div>
                                    {fieldErrors.maxPrice
                                        ? <p className="mt-1 text-xs text-red-500">{fieldErrors.maxPrice}</p>
                                        : <p className="mt-1 text-xs text-gray-500">Alert when price exceeds this. (0 = disabled)</p>}
                                </div>
                            </div>
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
                            {loading ? 'Saving…' : (isEditing ? 'Update Item' : 'Save Item')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventory;
