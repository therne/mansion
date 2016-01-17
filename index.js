'use strict';

module.exports = MansionFactory;

var fs = require('fs');
var koa = require('koa');
var Path = require('path');
var log = require('./lib/logger');
var cottage = require('../cottage');
var classic = require('./lib/classic');

function MansionFactory(options) {
    if (this instanceof MansionFactory) {
        throw new Error("You need call 'mansion()' to create new router!");
    }

    var app = cottage(options);

    app.importRoutes = function(path) {
        importRecursive(app, path);
    }

    app.listen = function(port) {
        koa().use(app).listen(8080);
        log('Server started at http://localhost:%d/', port);
    }

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
