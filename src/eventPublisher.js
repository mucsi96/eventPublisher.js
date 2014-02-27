/*global $, setTimeout*/
/**
 * @title Nano Event Publisher
 * @module ep
 */
var EventPublisher = function () {
    var eventHandlers = {};

    function publishEvents(moduleName, eventName, data) {
        var listeners,
            i,
            len,
            promises = [],
            deferred,
            handler = function (i, moduleName, eventName, deferred, data) {
                return function () {
                    listeners[i](
                        {
                            moduleName: moduleName,
                            eventName: eventName,
                            deferred: deferred,
                            data: data
                        }
                    );
                };
            };

        if (eventHandlers[eventName] !== undefined && eventHandlers[eventName][moduleName] !== undefined && eventHandlers[eventName][moduleName].callbacks instanceof Array) {
            listeners = eventHandlers[eventName][moduleName].callbacks;
            for (i = 0, len = listeners.length; i < len; i += 1) {
                if (typeof listeners[i] === "function") {
                    deferred = $.Deferred();
                    promises.push(deferred.promise());
                    setTimeout(handler(i, moduleName, eventName, deferred, data), 0);
                }
            }
        }

        return promises;
    }

    /**
     * Publish named event from given module and passes the data object to event handler parameter object on .data path
     * @param {string} eventName events name
     * @param {string} moduleName module name
     * @param {object} data data object passed to event handlers on .data path
     * @returns {object} jQuery promise
     */
    function publish(eventName, moduleName, data) {
        var promises = [];
        promises = promises.concat(publishEvents(moduleName, eventName, data));
        promises = promises.concat(publishEvents(null, eventName, data));
        promises = promises.concat(publishEvents(moduleName, null, data));

        return $.when.apply(this, promises);
    }

    /**
     * Subscribes on a given module given event with a callback function. If module name or event name is null all module events or given module every event will trigger the callback respectively
     * @param {string} eventName events name
     * @param {string} moduleName modules name
     * @param {function} callback event handler function. As parameter it will get an object containing: triggering module name, event name, data, jQuery deferred
     */
    function subscribe(eventName, moduleName, callback) {
        if (!eventHandlers[eventName]) {
            eventHandlers[eventName] = {};
        }

        if (!eventHandlers[eventName][moduleName]) {
            eventHandlers[eventName][moduleName] = {
                callbacks: []
            };
        }

        eventHandlers[eventName][moduleName].callbacks.push(callback);
    }

    /**
     * Unsubscribes from a given module given event all event handlers
     * @param {string} eventName event name
     * @param {string} moduleName module name
     */
    function unsubscribeAll(eventName, moduleName) {
        if (eventHandlers[eventName] !== undefined && eventHandlers[eventName][moduleName]) {
            eventHandlers[eventName][moduleName] = undefined;
        }
    }

    /**
     * Unsubscribes from a given module given event given event handler
     * @param {string} eventName event name
     * @param {string} moduleName module name
     * @param {function} callback event handler
     */
    function unsubscribe(eventName, moduleName, callback) {
        var index,
            listeners;
        if (eventHandlers[eventName] !== undefined && eventHandlers[eventName][moduleName] && eventHandlers[eventName][moduleName].callbacks instanceof Array) {
            listeners = eventHandlers[eventName][moduleName].callbacks;
            index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Resets own state to initial. Forgets every registered subscriptions. Useful for testing.
     */
    function reset() {
        eventHandlers = {};
    }

    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribeAll: unsubscribeAll,
        unsubscribe: unsubscribe,
        reset: reset
    };
};

