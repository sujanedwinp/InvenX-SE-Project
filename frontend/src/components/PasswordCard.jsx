import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, CheckCircle2, Circle } from 'lucide-react';
import { changePassword } from '../services/user';
import { PASSWORD_RULES, checkPassword } from '../utils/validation';

// ─── Password Strength Indicator (reused from Register) ──────────────────────

function PasswordStrengthIndicator({ password }) {
    const { passed } = checkPassword(password || '');
    const hasTyped   = password.length > 0;

    return (
        <div className="mt-2 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--font)', opacity: 0.55 }}>
                Password must contain:
            </p>
            <ul className="space-y-1">
                {PASSWORD_RULES.map(({ key, label }) => {
                    const done = passed.has(key);
                    return (
                        <li
                            key={key}
                            className="flex items-center gap-2 text-xs transition-colors duration-200"
                            style={{
                                color: done
                                    ? '#22c55e'
                                    : hasTyped
                                    ? '#ef4444'
                                    : 'var(--font)',
                                opacity: done ? 1 : hasTyped ? 0.9 : 0.4
                            }}
                        >
                            {done
                                ? <CheckCircle2 size={13} className="flex-shrink-0" />
                                : <Circle      size={13} className="flex-shrink-0" />}
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// ─── Password Card ────────────────────────────────────────────────────────────

const plainFields = [
    { name: 'currentPassword', label: 'Current Password', showIndicator: false },
    { name: 'newPassword',     label: 'New Password',     showIndicator: true  },
    { name: 'confirmPassword', label: 'Confirm New Password', showIndicator: false },
];

function PasswordCard() {
    const [form, setForm]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw]     = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess]   = useState(false);
    const [error, setError]       = useState('');

    const pwCheck = checkPassword(form.newPassword);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setSuccess(false);
    };

    const toggleShow = key => setShowPw(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSubmit = async e => {
        e.preventDefault();

        // ── Client-side validation ─────────────────────────────────────────
        if (!form.currentPassword) {
            setError('Current password is required.');
            return;
        }
        if (!pwCheck.valid) {
            setError(`New password is missing: ${pwCheck.failed.join(', ')}.`);
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match.');
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {plainFields.map(({ name, label, showIndicator }) => (
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
                        {/* Show strength indicator only for the new password field */}
                        {showIndicator && <PasswordStrengthIndicator password={form.newPassword} />}
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
                    disabled={submitting || !pwCheck.valid}
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
