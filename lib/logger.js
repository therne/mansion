
const util = require('util');
const moment = require('moment');
const colors = require('colors/safe');

function log(msg, ...args) {
    const message = util.format.apply(this, [msg, ...args]);
    const now = moment().format('YY/MM/DD hh:mm:ss A');
    console.log(colors.gray(`[${now}]`) + ' ' + message);
}

module.exports = log;