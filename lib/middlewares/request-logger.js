
const colors = require('colors/safe');
const log = require('./../logger');

/**
 * Default request logger for mansion.js
 */
module.exports = function() {
    return async function requestLogger(context, next) {
        const start = new Date;
        await next();
        const elapsed = new Date - start;
        const { method, url, status } = context;

        log(`${method} ${url} - %s, ${elapsed}ms`, status >= 500 ? colors.red(this.status) : status);
    }
};