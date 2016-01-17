
var util = require('util');
var moment = require('moment');
var colors = require('colors/safe');

module.exports = function log(msg) {
    var message = util.format.apply(this, arguments);
    var timeStr = moment().format('YY/MM/DD hh:mm:ss A');
    console.log(colors.gray('[' + timeStr + ']') + ' ' + message);
}