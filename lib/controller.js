/**
 * Code written by vista in 2016. 3. 6.. Licensed Under MIT License.
 */
const store = new Map();

function define(key, controller) {
    if (typeof key !== 'string') {
        controller = key;
        key = null;
    }
    if (typeof controller !== 'function') {
        if (controller instanceof Array) {
            controller.filter(f => typeof f === 'function').map(define);

        } else if (typeof controller === 'object') {
            for (const k in controller) {
                if (controller.hasOwnProperty(k)) define(k, controller[k]);
            }
        }
        return;
    }

    if (!key && !controller.name) throw Error("you must give controller function's name!");
    store.set(key || controller.name, controller);
}

function Controller(name) {
    if (this instanceof Controller) {
        // class extending: register all method in subclass
        // FIXME
        const proto = this.constructor.prototype;
        for (const k in proto) {
            if (proto.hasOwnProperty(k)) define(k, proto[k]);
        }
        return;
    }
    // default: get controller
    if (!store.has(name)) throw Error(`Controller ${name} is not defined.`);
    return store.get(name);
}

Controller.define = define;
module.exports = Controller;
