'use strict';

/**
 * Default REST API middleware packages for mansion.js.
 * @author therne
 */
const mansion = require('../mansion');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('./request-logger');
const errorHandlers = require('./error-handlers');
const colors = require('colors/safe');
const log = require('./../logger');

module.exports = function makeRest() {
    const app = mansion();
    app.use(errorHandler);
    app.use(requestLogger());
    app.use(bodyParser());
    app.setNotFoundHandler(notFound);
    return app;
};

/**
 * 404 Not Found Handler.
 */
function* notFound(next) {
    this.body = errorHandlers.notFound(this);
    this.status = 404;
    yield *next;
}

/**
 * 500 Internal Server Error Handler.
 * Catches all error.
 */
function* errorHandler(next) {
    try {
        yield* next;

    } catch (err) {
        this.__debug = true;
        this.body = errorHandlers.error(this, err);
        this.status = 500;
        log('%s %s - %s', this.method, this.url, colors.red('500'));
        log('%s  %s', colors.grey('⎿'), colors.red(err.name + ' : ' + err.message));
        log('%s', prettyStack(err.stack));
    }
}

function prettyStack(stack) {
    // remove first line
    stack = stack.substring(stack.indexOf('\n')+1);
    stack = stack.replace(/  /g, '');
    stack = stack.replace(/\n/g, '\n                            ');
    stack = '     ' + stack;
    return stack;
}