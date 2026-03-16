const PASSWORD_REGEX = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*()]/,
};

/**
 * Validates a password against all required rules.
 * @param {string} pw
 * @returns {{ valid: boolean, message: string }}
 */
function validatePassword(pw) {
    if (!pw || typeof pw !== 'string') {
        return { valid: false, message: 'Password is required.' };
    }
    if (pw.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters.' };
    }
    if (!PASSWORD_REGEX.uppercase.test(pw)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!PASSWORD_REGEX.lowercase.test(pw)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!PASSWORD_REGEX.number.test(pw)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    if (!PASSWORD_REGEX.special.test(pw)) {
        return { valid: false, message: 'Password must contain at least one special character [!@#$%^&*()].' };
    }
    return { valid: true, message: '' };
}

const DBID_REGEX = /^[a-zA-Z0-9]+$/;
const DBID_MIN = 8;
const DBID_MAX = 16;
const NAME_MAX = 16;

/**
 * Validates registration payload fields (name, dbid, password).
 * @param {{ name: string, dbid?: string, password: string }} fields
 * @returns {{ valid: boolean, message: string }}
 */
function validateRegistration({ name, dbid, password }) {
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
        return { valid: false, message: 'Name is required.' };
    }
    if (trimmedName.length > NAME_MAX) {
        return { valid: false, message: `Name must be at most ${NAME_MAX} characters.` };
    }
    if (dbid) {
        const trimmedDbid = dbid.trim();
        if (trimmedDbid.length < DBID_MIN || trimmedDbid.length > DBID_MAX) {
            return { valid: false, message: `Database ID must be ${DBID_MIN}–${DBID_MAX} characters.` };
        }
        if (!DBID_REGEX.test(trimmedDbid)) {
            return { valid: false, message: 'Database ID may only contain letters and numbers.' };
        }
    }

    return validatePassword(password);
}

const ITEM_NAME_MAX = 16;
const NUMERIC_MIN = 1;
const NUMERIC_MAX = 999_999_999;

/**
 * Validates a required integer field.
 * @param {any} value
 * @param {string} label
 * @returns {{ valid: boolean, message: string }}
 */
function validateInteger(value, label) {
    const n = Number(value);
    if (value === '' || value === null || value === undefined) {
        return { valid: false, message: `${label} is required.` };
    }
    if (!Number.isFinite(n)) {
        return { valid: false, message: `${label} must be a number.` };
    }
    if (!Number.isInteger(n)) {
        return { valid: false, message: `${label} must be a whole number (no decimals).` };
    }
    if (n < NUMERIC_MIN) {
        return { valid: false, message: `${label} must be at least ${NUMERIC_MIN}.` };
    }
    if (n > NUMERIC_MAX) {
        return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    }
    return { valid: true, message: '' };
}

/**
 * Validates a required positive number field (decimals allowed).
 * @param {any} value
 * @param {string} label
 * @returns {{ valid: boolean, message: string }}
 */
function validatePositiveNumber(value, label) {
    const n = Number(value);
    if (value === '' || value === null || value === undefined) {
        return { valid: false, message: `${label} is required.` };
    }
    if (!Number.isFinite(n)) {
        return { valid: false, message: `${label} must be a number.` };
    }
    if (n < NUMERIC_MIN) {
        return { valid: false, message: `${label} must be at least ${NUMERIC_MIN}.` };
    }
    if (n > NUMERIC_MAX) {
        return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    }
    return { valid: true, message: '' };
}

/**
 * Validates optional alert threshold (0 = disabled; if set, must be ≥ 1).
 * @param {any} value
 * @param {string} label
 * @param {boolean} isInteger
 * @returns {{ valid: boolean, message: string }}
 */
function validateAlertThreshold(value, label, isInteger = true) {
    const n = Number(value);
    if (value === 0 || value === '0' || value === '' || value === null || value === undefined || n === 0) {
        return { valid: true, message: '' };
    }
    if (!Number.isFinite(n)) {
        return { valid: false, message: `${label} must be a number.` };
    }
    if (isInteger && !Number.isInteger(n)) {
        return { valid: false, message: `${label} must be a whole number.` };
    }
    if (n < 0) {
        return { valid: false, message: `${label} cannot be negative.` };
    }
    if (n > NUMERIC_MAX) {
        return { valid: false, message: `${label} must be at most ${NUMERIC_MAX}.` };
    }
    return { valid: true, message: '' };
}

/**
 * Validates all fields for a create/update inventory item payload.
 * @param {{ name: string, quantity: any, price: any, minQty?: any, maxPrice?: any }} fields
 * @returns {{ valid: boolean, message: string }}
 */
function validateItemFields({ name, quantity, price, minQty, maxPrice }) {
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
        return { valid: false, message: 'Item name is required.' };
    }
    if (trimmedName.length > ITEM_NAME_MAX) {
        return { valid: false, message: `Item name must be at most ${ITEM_NAME_MAX} characters.` };
    }

    const qtyResult = validateInteger(quantity, 'Quantity');
    if (!qtyResult.valid) return qtyResult;

    const priceResult = validatePositiveNumber(price, 'Price');
    if (!priceResult.valid) return priceResult;

    if (minQty !== undefined) {
        const minQtyResult = validateAlertThreshold(minQty, 'Min Quantity', true);
        if (!minQtyResult.valid) return minQtyResult;
    }

    if (maxPrice !== undefined) {
        const maxPriceResult = validateAlertThreshold(maxPrice, 'Max Price', false);
        if (!maxPriceResult.valid) return maxPriceResult;
    }

    return { valid: true, message: '' };
}

module.exports = {
    validatePassword,
    validateRegistration,
    validateItemFields,
};
