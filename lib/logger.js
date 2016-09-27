
const util = require('util');
const moment = require('moment');
const colors = require('colors/safe');

module.exports = function log(msg) {
    var message = util.format.apply(this, arguments);
    var timeStr = moment().format('YY/MM/DD hh:mm:ss A');
    console.log(colors.gray('[' + timeStr + ']') + ' ' + message);
};