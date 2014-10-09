/**
 *
 * var woopra = require('woopra');
 *
 * woopra.config({
 *   domain: 'woopra.com'
 * });
 *
 * woopra.track();
 * woopra.identify({
 * id:
 * email:
 * });
 * woopra.
 */

var http = require('http');
var https = require('https');

var _extend = require('util')._extend;

var _config  = {
        ssl: true
    },
    _defaultClient = {
        ip: '0.0.0.0'
    },
    _client = _defaultClient,
    _visitor = {},
    _session = {};

var API_URL = '//www.woopra.com/track/';

/**
 * Creates a URL string of key=value, concatenated by an `&`
 */
function buildUrlParams(params, prefix) {
    var _prefix = prefix || '',
        key,
        p = [];

    if (typeof params === 'undefined') {
        return;
    }

    for (key in params) {
        if (params.hasOwnProperty(key)) {
            p.push(_prefix + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
    }
    return p.join('&');
}


/**
 * Sends tracking/identify requests to Woopra.  All requests will include
 * visitor properties and client options data
 */
function request(endpoint, data, cb) {
    var protocol = _config.ssl ? 'https' : 'http',
        method = _config.ssl ? https.get : http.get,
        _data = data || {},
        params = [];

    if (!_config.domain) {
        throw new Error('`domain` needs to be configured');
    }

    if (!_visitor.cookie && !_visitor.id && !_visitor.email) {
        throw new Error('Missing `cookie` or `email` property for visitor');
    }

    params.push(buildUrlParams(client()));
    params.push(buildUrlParams(_visitor, 'cv_'));

    if (_data.eventData) {
        params.push(buildUrlParams(_data.eventData, 'ce_'));
    }

    return method(protocol + ':' + API_URL + endpoint + '?' + params.join('&'), function() {
        if (typeof cb === 'function') {
            cb();
        }
    });
}
/* Public functions */

/**
 * Sets configuration options
 */
function config(properties) {
    if (typeof properties === 'undefined') {
        return _config;
    }
    else {
        _extend(_config, properties);
    }

    return this;
}

/**
 * Sets client data
 *
 * screen: window.screen.width + 'x' + window.screen.height,
 * language: window.navigator.browserLanguage || window.navigator.language || "",
 * referer: document.referrer,
 * cookie
 */
function client(properties) {
    if (typeof properties === 'undefined') {
        return _extend(_client, {
            website: _config.domain,
            app: 'node'
        });
    }
    else {
        _extend(_client, properties);
    }
}

/**
 * Sets visitor properties, does not send a HTTP request to Woopra
 */
function identify(id, properties) {
    if (typeof id === 'object') {
        _extend(_visitor, id);
    }

    else {
        _extend(_visitor, properties);
        _visitor.email = id;
    }

    return this;
}

/**
 * Identifies a user with Woopra without creating an event
 */
function push(cb) {
    return request('identify', {} , cb);
}

function track(name, options) {
    var event = _extend({}, options),
        cb,
        _hash,
        _cb = arguments[arguments.length - 1];

    if (typeof _cb === 'function') {
        cb = _cb;
    }

    // require event name
    if (!name || typeof name !== 'string') {
        throw new Error('track() requires a `name` parameter');
    }

    event.name = name;

    return request('ce', {
        eventData: event
    }, cb);
}

function reset() {
    _client = _defaultClient;
    _visitor = {};
}

module.exports = {
    config: config,
    client: client,
    reset: reset,
    identify: identify,
    push: push,
    track: track
};
