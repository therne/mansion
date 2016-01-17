'use strict';

/**
 * Default request logger for mansion.js
 */

var mansion = require('../');
var colors = require('colors/safe');
var util = require('util');
var log = require('./logger');

module.exports = function() {
    return function* requestLogger(next) {
        var start = new Date;
        yield next;
        var ms = new Date - start;

        log('%s %s - %s, %dms', this.method, this.url,
                (this.status >= 500 ? colors.red(this.status) : this.status), ms);
    }
}
