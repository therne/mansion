'use strict';

/**
 * Default REST API middleware packages for mansion.js.
 * @author therne
 */
const Mansion = require('../mansion');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('./request-logger');
const errorHandlers = require('./error-handlers');
const colors = require('colors/safe');
const log = require('./../logger');

module.exports = function makeRest() {
    const app = new Mansion();
    app.setNotFoundHandler(notFound);
    app.use(errorHandler);
    app.use(requestLogger());
    app.use(bodyParser());
    return app;
};

/**
 * 404 Not Found Handler.
 */
async function notFound(context, next) {
    context.body = errorHandlers.notFound(context);
    context.status = 404;
    await next();
}

/**
 * 500 Internal Server Error Handler.
 * Catches all error.
 */
async function errorHandler(context, next) {
    try {
        await next();

    } catch (err) {
        context.__debug = true;
        context.body = errorHandlers.error(context, err);
        context.status = 500;
        log('%s %s - %s', context.method, context.url, colors.red('500'));
        log('%s  %s', colors.grey('⎿'), colors.red(`${err.name} : ${err.message}`));
        log('%s', prettyStack(err.stack));
    }
}

function prettyStack(stack) {
    stack = stack.substring(stack.indexOf('\n')+1); // remove first line
    stack = stack.replace(/  /g, '');
    stack = stack.replace(/\n/g, '\n                            ');
    stack = '     ' + stack;
    return stack;
}