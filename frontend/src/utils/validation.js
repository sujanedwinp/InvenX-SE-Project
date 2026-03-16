
export const PASSWORD_RULES = [
    { key: 'uppercase', label: '1 Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { key: 'lowercase', label: '1 Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { key: 'number', label: '1 Number', test: (pw) => /[0-9]/.test(pw) },
    { key: 'special', label: '1 Special character [!@#$%^&*()]', test: (pw) => /[!@#$%^&*()]/.test(pw) },
    { key: 'minLen', label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
];

/**
 * Returns which rules pass/fail for a given password.
 * @param {string} pw
 * @returns {{ passed: Set<string>, failed: string[], valid: boolean }}
 */
export function checkPassword(pw) {
    const passed = new Set();
    const failed = [];
    for (const rule of PASSWORD_RULES) {
        if (rule.test(pw)) {
            passed.add(rule.key);
        } else {
            failed.push(rule.label);
        }
    }
    return { passed, failed, valid: failed.length === 0 };
}


export const NAME_MAX_LENGTH = 16;

/**
 * Validates a user / item name.
 * @param {string} name
 * @returns {{ valid: boolean, message: string }}
 */
export function validateName(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return { valid: false, message: 'Name is required.' };
    if (trimmed.length > NAME_MAX_LENGTH)
        return { valid: false, message: `Name must be at most ${NAME_MAX_LENGTH} characters.` };
    return { valid: true, message: '' };
}

export const DBID_MIN = 8;
export const DBID_MAX = 16;
export const DBID_REGEX = /^[a-zA-Z0-9]+$/;

/**
 * Validates a user-supplied Database ID.
 * @param {string} dbid
 * @returns {{ valid: boolean, message: string }}
 */
export function validateDbid(dbid) {
    const val = (dbid || '').trim();
    if (!val) return { valid: false, message: 'Database ID is required.' };
    if (val.length < DBID_MIN || val.length > DBID_MAX)
        return { valid: false, message: `Database ID must be ${DBID_MIN}–${DBID_MAX} ALPHANUMERIC characters only.` };
    if (!DBID_REGEX.test(val))
        return { valid: false, message: 'Database ID may only contain letters and numbers.' };
    return { valid: true, message: '' };
}

export const NUMERIC_MIN = 1;
export const NUMERIC_MAX = 999_999_999;

/**
 * Validates a required numeric field (quantity — integers only).
 * @param {string|number} value
 * @param {string} label
 * @returns {{ valid: boolean, message: string }}
 */
export function validateInteger(value, label) {
    const str = String(value ?? '').trim();
    if (str === '') return { valid: false, message: `${label} is required.` };
    const n = Number(str);
    if (!Number.isFinite(n)) return { valid: false, message: `${label} must be a number.` };
    if (!Number.isInteger(n)) return { valid: false, message: `${label} must be a whole number.` };
    if (n < NUMERIC_MIN) return { valid: false, message: `${label} must be at least ${NUMERIC_MIN}.` };
    if (n > NUMERIC_MAX) return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    return { valid: true, message: '' };
}

/**
 * Validates a required numeric field (price — decimals allowed).
 * @param {string|number} value
 * @param {string} label
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePositiveNumber(value, label) {
    const str = String(value ?? '').trim();
    if (str === '') return { valid: false, message: `${label} is required.` };
    const n = Number(str);
    if (!Number.isFinite(n)) return { valid: false, message: `${label} must be a number.` };
    if (n < NUMERIC_MIN) return { valid: false, message: `${label} must be at least ${NUMERIC_MIN}.` };
    if (n > NUMERIC_MAX) return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    return { valid: true, message: '' };
}

/**
 * Validates an optional alert threshold (0 = disabled, or ≥ 1 and ≤ max).
 * @param {string|number} value
 * @param {string} label
 * @param {boolean} isInteger
 * @returns {{ valid: boolean, message: string }}
 */
export function validateAlertThreshold(value, label, isInteger = true) {
    const str = String(value ?? '').trim();
    if (str === '' || str === '0') return { valid: true, message: '' }; // 0 = disabled, always OK
    const n = Number(str);
    if (!Number.isFinite(n)) return { valid: false, message: `${label} must be a number.` };
    if (isInteger && !Number.isInteger(n))
        return { valid: false, message: `${label} must be a whole number.` };
    if (n < 0) return { valid: false, message: `${label} cannot be negative.` };
    if (n > NUMERIC_MAX) return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    return { valid: true, message: '' };
}
