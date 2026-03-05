import React, { useState } from 'react';
import { Palette, Save, Check, Loader2, RotateCcw } from 'lucide-react';
import { useTheme, DEFAULT_THEME } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { updateColors } from '../services/user';

// Labels and keys for the four theme color slots
const COLOR_SLOTS = [
    { key: 'bg', label: 'c1 – Background', desc: 'Page / card background' },
    { key: 'chart', label: 'c2 – Highlight', desc: 'Charts & accent elements' },
    { key: 'border', label: 'c3 – Border', desc: 'Card borders & dividers' },
    { key: 'font', label: 'c4 – Text', desc: 'Primary text color' },
];

/**
 * ColorPickerCard
 * Lets the user pick four UI theme colors, shows a live preview, and saves to DB.
 * On save, the global ThemeContext is updated so the change propagates app-wide instantly.
 */
function ColorPickerCard() {
    const { theme, setTheme } = useTheme();
    const { updateUser } = useAuth();

    // Local draft — changes here affect the preview card but NOT the global theme yet
    const [draft, setDraft] = useState({ ...theme });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (key, value) => {
        setDraft(prev => ({ ...prev, [key]: value }));
        setError('');
        setSaved(false);
    };

    const persist = async (colors) => {
        setSaving(true);
        setError('');
        setSaved(false);
        try {
            const data = await updateColors(colors);
            // Apply to ThemeContext → CSS variables update globally right now
            setTheme(data.colors);
            // Persist to AuthContext user state + localStorage
            updateUser({ colors: data.colors });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError(err.message || 'Failed to save colors. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSave = () => persist(draft);

    const handleReset = () => {
        setDraft({ ...DEFAULT_THEME });
        persist(DEFAULT_THEME);
    };

    return (
        <div
            className="rounded-xl p-6 shadow-sm space-y-6"
            style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="p-2 rounded-lg"
                    style={{ background: 'var(--chart)', opacity: 0.15 }}
                />
                <span style={{ position: 'absolute' }}>
                    <Palette size={20} style={{ color: 'var(--chart)' }} />
                </span>
                <div style={{ marginLeft: '2.25rem' }}>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--font)' }}>
                        Color Change
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--font)', opacity: 0.55 }}>
                        Customize your UI theme globally
                    </p>
                </div>
            </div>

            {/* Color pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COLOR_SLOTS.map(({ key, label, desc }) => (
                    <div
                        key={key}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all"
                        style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}
                    >
                        {/* Native color picker swatch */}
                        <label
                            htmlFor={`color-${key}`}
                            className="cursor-pointer flex-shrink-0"
                            title={label}
                        >
                            <div
                                className="w-10 h-10 rounded-lg shadow-inner border-2 transition-transform hover:scale-110"
                                style={{ background: draft[key], borderColor: 'var(--border)' }}
                            />
                            <input
                                id={`color-${key}`}
                                type="color"
                                value={draft[key]}
                                onChange={e => handleChange(key, e.target.value)}
                                className="sr-only"
                            />
                        </label>

                        {/* Label + hex value */}
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--font)' }}>
                                {label}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--font)', opacity: 0.5 }}>{desc}</p>
                            <p
                                className="text-xs font-mono mt-0.5"
                                style={{ color: 'var(--chart)' }}
                            >
                                {draft[key]}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Preview Card */}
            <div
                className="rounded-lg p-4"
                style={{ background: draft.bg, border: `2px solid ${draft.border}` }}
            >
                <p className="text-xs font-semibold mb-2" style={{ color: draft.font, opacity: 0.6 }}>
                    LIVE PREVIEW
                </p>
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-8 rounded-full"
                        style={{ background: draft.chart }}
                    />
                    <div>
                        <p className="text-sm font-semibold" style={{ color: draft.font }}>
                            Theme Preview
                        </p>
                        <p className="text-xs" style={{ color: draft.font, opacity: 0.55 }}>
                            This is how your colors will look
                        </p>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-xs px-3 py-2 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'var(--chart)', color: '#ffffff' }}
                >
                    {saving ? (
                        <><Loader2 size={16} className="animate-spin" /> Saving…</>
                    ) : saved ? (
                        <><Check size={16} /> Saved!</>
                    ) : (
                        <><Save size={16} /> Save Colors</>
                    )}
                </button>

                <button
                    onClick={handleReset}
                    disabled={saving}
                    title="Reset to default theme"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--font)'
                    }}
                >
                    <RotateCcw size={15} />
                    Reset
                </button>
            </div>
        </div>
    );
}

export default ColorPickerCard;
