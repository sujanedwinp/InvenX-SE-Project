import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, ShieldOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/user';

/**
 * PasswordCard
 * Shows a password-change form if the user logged in via username.
 * If the user logged in via dbid (DB Name), renders a disabled informational panel.
 */
function PasswordCard() {
    const { user } = useAuth();
    const loginMethod = user?.loginMethod || 'dbid';

    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setSuccess(false);
    };

    const toggleShow = key => setShowPw(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
            setSuccess(true);
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Disabled state: logged in via DB Name ──────────────────────────────────
    if (loginMethod !== 'username') {
        return (
            <div
                className="rounded-xl p-6 shadow-sm"
                style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <ShieldOff size={20} style={{ color: 'var(--font)', opacity: 0.4 }} />
                    <h2 className="text-lg font-bold" style={{ color: 'var(--font)' }}>
                        Change Password
                    </h2>
                </div>

                <div
                    className="rounded-lg p-5 flex flex-col items-center gap-3 text-center"
                    style={{ border: '1.5px dashed var(--border)', opacity: 0.7 }}
                >
                    <Lock size={32} style={{ color: 'var(--font)', opacity: 0.3 }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--font)' }}>
                        Password cannot be changed when logged in via DB Name.
                    </p>
                    <p className="text-xs" style={{ color: 'var(--font)', opacity: 0.5 }}>
                        To change your password, log in using a username instead.
                    </p>
                </div>
            </div>
        );
    }

    // ── Active state: username login ───────────────────────────────────────────
    const fields = [
        { name: 'currentPassword', label: 'Current Password' },
        { name: 'newPassword', label: 'New Password' },
        { name: 'confirmPassword', label: 'Confirm New Password' },
    ];

    return (
        <div
            className="rounded-xl p-6 shadow-sm"
            style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}
        >
            <div className="flex items-center gap-3 mb-5">
                <Lock size={20} style={{ color: 'var(--chart)' }} />
                <h2 className="text-lg font-bold" style={{ color: 'var(--font)' }}>
                    Change Password
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(({ name, label }) => (
                    <div key={name}>
                        <label
                            htmlFor={`pw-${name}`}
                            className="block text-xs font-semibold mb-1.5"
                            style={{ color: 'var(--font)', opacity: 0.7 }}
                        >
                            {label}
                        </label>
                        <div className="relative">
                            <input
                                id={`pw-${name}`}
                                name={name}
                                type={showPw[name] ? 'text' : 'password'}
                                value={form[name]}
                                onChange={handleChange}
                                required
                                className="w-full pr-10 py-2.5 px-3 rounded-lg text-sm outline-none transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1.5px solid var(--border)',
                                    color: 'var(--font)'
                                }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow(name)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                                style={{ color: 'var(--font)' }}
                                tabIndex={-1}
                            >
                                {showPw[name] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                ))}

                {error && (
                    <p className="text-xs px-3 py-2 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-xs px-3 py-2 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1.5">
                        <Check size={14} /> Password updated successfully!
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    style={{ background: 'var(--chart)', color: '#ffffff' }}
                >
                    {submitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Updating…</>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </form>
        </div>
    );
}

export default PasswordCard;
