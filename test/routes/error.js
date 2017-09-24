/**
 * Code written by therne in 2016. 9. 27.
 */
'use strict';

const mansion = require('../..');
const app = mansion();

app.get('/', function*(req, res) {
    return 'Hello mansion!';
});

module.exports = app;