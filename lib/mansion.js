
const fs = require('fs');
const Path = require('path');
const log = require('./logger');
const Cottage = require('cottage');
const classicMode = require('./middlewares/classic');
const webMode = require('./middlewares/web');

/**
 * Mansion - A full-stack framework based on Cottage
 * Copyright (c) 2016 Therne
 */
class MansionApp extends Cottage {

    constructor(options) {
        super(options);
    }

    /**
     * Classic mode - with default plugins for REST API server attached.
     */
    static classic() {
        return classicMode();
    }

    /**
     * Web mode - with default plugins for REST + web server attached.
     */
    static web() {
        return webMode();
    }

    /**
     * Automatically scans routes and registers them.
     *
     * This function automatically scans module that exports a cottage/mansion {@link Router} instance.
     * Then, it will register them as a route. Note that a name or path of the module
     * will be URL path in the route (except 'index' -> '/')
     *
     * @param path {String} directory that will be scanned.
     */
    scanRoutes(path) {
        importRecursive(this, path);

        function importRecursive(app, path, rootPath = '') {
            if (path.indexOf('/') !== 0) {
                // convert relative path to absolute path
                path = Path.resolve(module.parent.filename, '..', path);
            }

            const files = fs.readdirSync(path);
            for (const name of files) {
                let filePath = Path.join(path, name);

                if (fs.lstatSync(filePath).isDirectory()) {
                    importRecursive(app, `${path}/${name}`, `${rootPath}${name}/`);
                    continue;
                }

                // remove .js extension
                const nameWithoutExt = name.substring(0, name.length - 3);

                const route = require(filePath.substring(0, filePath.length - 3));
                if (route instanceof CottageApp) {
                    if (nameWithoutExt === 'index') app.use(`/${rootPath}`, route);
                    else app.use(`/${rootPath}${nameWithoutExt}`, route);
                }
            }
        }
    }

    /**
     * Start server and listen to given port.
     * This is a shorthand for:
     *    require('koa')().use(app.callback()).listen()
     *
     * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/http.html|Node.js http module docs}
     */
    listen(port, handler) {
        super.listen(port, () => {
            log('Server started at http://localhost:%d/', port);
            if (handler) handler();
        });
    }
}

module.exports = MansionApp;

