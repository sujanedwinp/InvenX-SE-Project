import React, { useEffect, useState } from 'react';
import { UserCircle, Database, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ColorPickerCard from '../components/ColorPickerCard';
import PasswordCard from '../components/PasswordCard';

/**
 * Profile Page
 * Layout:
 *   ┌─────────────────────┬─────────────────────┐
 *   │  Left Panel         │  Color Picker Card  │
 *   │  (User Info)        ├─────────────────────┤
 *   │                     │  Password Card      │
 *   └─────────────────────┴─────────────────────┘
 *
 * All panels use CSS variables (--bg, --border, --font, --chart)
 * so they automatically reflect the active theme.
 */
function Profile() {
    const { user } = useAuth();

    // Format the ISO createdAt date nicely
    const createdAt = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : '—';

    const infoRows = [
        { icon: <Database size={15} />, label: 'DB Name', value: user?.dbid || '—' },
        { icon: <UserCircle size={15} />, label: 'User Name', value: user?.name || '—' },
        { icon: <ShieldCheck size={15} />, label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—' },
        { icon: <Calendar size={15} />, label: 'Account Created', value: createdAt },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page title */}
            <div>
                <h1
                    className="text-2xl font-bold"
                    style={{ color: 'var(--font)' }}
                >
                    Profile
                </h1>
                <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--font)', opacity: 0.55 }}
                >
                    Manage your account information and UI preferences.
                </p>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── Left Panel – User Info ─────────────────────────────────── */}
                <div
                    className="rounded-xl p-8 shadow-sm h-full flex flex-col gap-6"
                    style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}
                >
                    {/* Avatar + name headline */}
                    <div className="flex flex-col items-center gap-4 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: 'var(--chart)', opacity: 0.9 }}
                        >
                            <UserCircle size={48} color="#ffffff" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--font)' }}>
                                {user?.name || 'User'}
                            </h2>
                            <span
                                className="inline-flex items-center mt-1 px-3 py-0.5 rounded-full text-xs font-semibold"
                                style={{ background: 'var(--chart)', color: '#ffffff', opacity: 0.85 }}
                            >
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </span>
                        </div>
                    </div>

                    {/* Detail rows */}
                    <div className="space-y-4 flex-1">
                        {infoRows.map(({ icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-start gap-3 p-4 rounded-lg"
                                style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
                            >
                                <span style={{ color: 'var(--chart)', marginTop: '2px', opacity: 0.85 }}>
                                    {icon}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--font)', opacity: 0.5 }}>
                                        {label}
                                    </p>
                                    <p className="text-sm font-medium mt-0.5 truncate" style={{ color: 'var(--font)' }}>
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active status badge */}
                    <div
                        className="flex items-center gap-2 justify-center py-2 rounded-lg"
                        style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.2)' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-semibold text-green-400">Account Active</span>
                    </div>
                </div>

                {/* ── Right Column ───────────────────────────────────────────── */}
                <div className="flex flex-col gap-6">
                    <ColorPickerCard />
                    <PasswordCard />
                </div>
            </div>
        </div>
    );
}

export default Profile;
