import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import AuthLayout from '../components/AuthLayout';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import {
    PASSWORD_RULES,
    checkPassword,
    validateName,
    validateDbid,
    NAME_MAX_LENGTH,
    DBID_MIN,
    DBID_MAX
} from '../utils/validation';

function PasswordStrengthIndicator({ password }) {
    const { passed } = checkPassword(password || '');
    const hasTyped = password.length > 0;

    return (
        <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Password must contain:
            </p>
            <ul className="space-y-1">
                {PASSWORD_RULES.map(({ key, label }) => {
                    const done = passed.has(key);
                    return (
                        <li
                            key={key}
                            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${done
                                    ? 'text-green-600 dark:text-green-400'
                                    : hasTyped
                                        ? 'text-red-500 dark:text-red-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            {done ? (
                                <CheckCircle2 size={13} className="flex-shrink-0" />
                            ) : (
                                <Circle size={13} className="flex-shrink-0" />
                            )}
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ─── Register Page ────────────────────────────────────────────────────────────

const Register = () => {
    const [formData, setFormData] = useState({ name: '', dbId: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name' && value.length > NAME_MAX_LENGTH) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errors = {};

        const nameResult = validateName(formData.name);
        if (!nameResult.valid) errors.name = nameResult.message;

        const dbidResult = validateDbid(formData.dbId);
        if (!dbidResult.valid) errors.dbId = dbidResult.message;

        const pwCheck = checkPassword(formData.password);
        if (!pwCheck.valid) errors.password = `Password is missing: ${pwCheck.failed.join(', ')}.`;

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await registerUser(formData);
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pwCheck = checkPassword(formData.password);

    return (
        <AuthLayout
            title="Create an account"
            subtitle={<span>Already have a database? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link></span>}
        >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {error && (
                    <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400" role="alert">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Full Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            maxLength={NAME_MAX_LENGTH}
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white ${fieldErrors.name ? 'ring-red-400 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
                                }`}
                            placeholder="Your name"
                        />
                        <div className="flex justify-between mt-1">
                            {fieldErrors.name
                                ? <p className="text-xs text-red-500">{fieldErrors.name}</p>
                                : <span />}
                            <p className="text-xs text-gray-400">{formData.name.length}/{NAME_MAX_LENGTH}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="dbId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Database ID
                    </label>
                    <div className="mt-2">
                        <input
                            id="dbId"
                            name="dbId"
                            type="text"
                            required
                            value={formData.dbId}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white ${fieldErrors.dbId ? 'ring-red-400 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
                                }`}
                            placeholder="Unique ID for your inventory"
                        />
                        {fieldErrors.dbId
                            ? <p className="mt-1 text-xs text-red-500">{fieldErrors.dbId}</p>
                            : <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {DBID_MIN}–{DBID_MAX} alphanumeric characters. This is your login identifier.
                            </p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white ${fieldErrors.password ? 'ring-red-400 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
                                }`}
                        />
                        {fieldErrors.password && !formData.password && (
                            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                        )}
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading || !pwCheck.valid}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
