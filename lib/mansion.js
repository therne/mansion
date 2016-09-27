/**
 * Mansion - A full-stack framework based on Cottage
 * Copyright (c) 2016 Therne
 */
'use strict';

const fs = require('fs');
const koa = require('koa');
const util = require('util');
const Path = require('path');
const log = require('./logger');
const CottageApp = require('cottage');

function MansionApp(options) {
    if (!(this instanceof MansionApp)) return new MansionApp(options);
    MansionApp.super_.call(this, options);
}

util.inherits(MansionApp, CottageApp);
module.exports = MansionApp;

/**
 * Automatically scans routes and registers them.
 *
 * This function automatically scans module that exports a cottage/mansion {@link Router} instance.
 * Then, it will register them as a route. Note that a name or path of the module
 * will be URL path in the route (except 'index' -> '/')
 *
 * @param path {String} directory that will be scanned.
 */
MansionApp.prototype.scanRoutes = function(path) {
    importRecursive(this, path);

    function importRecursive(router, path, rootPath) {
        rootPath = rootPath || '';
        if (path.indexOf('/') !== 0) {
            // convert relative path to absolute path
            path = Path.resolve(module.parent.filename, '..', path);
        }

        var files = fs.readdirSync(path);
        for (let name of files) {
            let filePath = Path.join(path, name);

            if (fs.lstatSync(filePath).isDirectory()) {
                importRecursive(router, path + '/' + name, rootPath + name + '/');
                continue;
            }

            // remove .js extension
            name = name.substring(0, name.length - 3);

            let route = require(filePath.substring(0, filePath.length - 3));
            if (route instanceof CottageApp) {
                if (name == 'index') router.use('/' + rootPath, route);
                else router.use('/' + rootPath + name, route);
            }
        }
    }
};

/**
 * Start server and listen to given port.
 * This is a shorthand for:
 *    require('koa')().use(app.callback()).listen()
 *
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/http.html|Node.js http module docs}
 */
MansionApp.prototype.listen = function(port, handler) {
    let newHandler = function() {
        log('Server started at http://localhost:%d/', port);
        if (handler) handler();
    };
    CottageApp.prototype.listen.call(this, port, newHandler);
};

/**
 * Classic mode - with default plugins attached.
 */
MansionApp.classic = require('./middlewares/classic');
