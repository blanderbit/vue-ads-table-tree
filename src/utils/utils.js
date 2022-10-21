/**
 * Check if passed value is a valid Date type.
 * @param {String|Date} value - The value to validate.
 * @returns {boolean}
 */
export function isValidDate (value) {
    return Boolean(Date.parse(value));
}

/**
 * Executes passed code.
 * @param {String} code - Code that should be executed.
 * @returns {*} - The result of the executed code.
 */
export function evalCode (code) {
    return new Function(`return ${code}`)();
}

/**
 * Interpolate string variables.
 * Can parse variables / ternary condition passed in {} brackets.
 * In the future, this function can be improved, this is just an example,
 * so that it is possible to pass variables that need to be parsed in a string.
 * @param {String} str - The string that should be interpolated.
 * @param {Object} data - An object that contains the property keys to be interpolated.
 * @returns {String} - Interpolated string.
 */
export function interpolateStr (str, data) {
    const regexp = /{([^{]+)}/g;
    return str.replace(regexp, (ignore, key) => {
        // Check if key includes ternary operation.
        if (key.includes('>') && key.includes('?') && key.includes(':')) {
            const splitKey = key.split(' ');
            splitKey[0] = data[splitKey[0]];
            return evalCode(splitKey.join(' '));
        }
        return (key = data[key]) === null ? '' : key;
    });
}