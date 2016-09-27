'use strict';

/**
 * Default web middleware packages for mansion.
 * @author therne
 */
const mansion = require('../mansion');
const classic = require('./classic');
const cors = require('koa-cors');

module.exports = function makeWeb() {
    const app = classic();
    app.use(cors());
    return app;
};
