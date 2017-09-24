'use strict';

const classic = require('./classic');
const cors = require('koa2-cors');

/**
 * Default web middleware packages for mansion.
 * @author therne
 */
module.exports = function makeWeb() {
    const app = classic();
    app.use(cors());
    return app;
};
