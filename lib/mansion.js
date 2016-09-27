/**
 * Mansion - A full-stack framework based on Cottage
 * Copyright (c) 2016 Therne
 */
'use strict';

const fs = require('fs');
const koa = require('koa');
const Path = require('path');
const log = require('./logger');
const cottage = require('cottage');
const classic = require('./middlewares/classic');

function MansionFactory(options) {
    if (this instanceof MansionFactory) {
        throw new Error("You need call 'mansion()' to create new router!");
    }

    const app = cottage(options);

    app.importRoutes = function(path) {
        importRecursive(app, path);
    };

    app.listen = function(port) {
        app.listen.apply();
        log('Server started at http://localhost:%d/', port);
    };

    return app;
}

function importRecursive(router, path, rootPath) {
    rootPath = rootPath || '';
    if (path.indexOf('/') !== 0) {
        // convert relative path to absolute path
        path = Path.resolve(module.parent.filename, '..', path);
    }

    var files = fs.readdirSync(path);
    for (var i in files) {
        var name = files[i], filePath = Path.join(path, name);

        if (fs.lstatSync(filePath).isDirectory()) {
            importRecursive(router, path + '/' + name, rootPath + name + '/');
            continue;
        }

        name = name.substring(0, name.length-3); // remove .js extension

        var route = require(filePath.substring(0, filePath.length-3));
        if (name == 'index') router.use('/' + rootPath, route);
        else router.use('/' + rootPath + name, route);
    }
}

MansionFactory.classic = classic;
module.exports = MansionFactory;
