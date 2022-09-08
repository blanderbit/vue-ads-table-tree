/**
 * Check if passed value is a valid Date type.
 * @param {String|Date} value - The value to validate.
 * @returns {boolean}
 */
export function isValidDate (value) {
    return Boolean(Date.parse(value));
}