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
    };

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


function Woopra(key, options) {
    if (!key) {
        throw new Error('Missing your project key (usually your domain)');
    }

    this.projectKey = key;
    this.initialize.apply(this, arguments);
    this.options = _extend(this.options, _config);
    this.options = _extend(this.options, options);
}

Woopra.prototype = {
    initialize: function() {
        this._client = _extend({}, _defaultClient);
        this._visitor = {};
        this.options = {};
    },

    /**
     * Sends tracking/identify requests to Woopra.  All requests will include
     * visitor properties and client options data
     */
    request: function(endpoint, data, cb) {
        var protocol = this.options.ssl ? 'https' : 'http',
            method = this.options.ssl ? https.get : http.get,
            _data = data || {},
            params = [];

        if (!this.projectKey) {
            throw new Error('Missing your project key (usually your domain)');
        }

        if (!this._visitor.cookie && !this._visitor.id && !this._visitor.email) {
            throw new Error('Missing `cookie` or `email` property for visitor');
        }

        params.push(buildUrlParams(this.client()));
        params.push(buildUrlParams(this._visitor, 'cv_'));

        if (_data.eventData) {
            params.push(buildUrlParams(_data.eventData, 'ce_'));
        }

        return method(protocol + ':' + API_URL + endpoint + '?' + params.join('&'), function(res) {
            if (typeof cb === 'function') {
                cb(null, res);
            }
        }).on('error', function(e) {
            if (typeof cb === 'function') {
                cb(e, null);
            }
        });
    },

    /**
     * Sets configuration options
     */
    config: function(properties) {
        if (typeof properties === 'undefined') {
            return this.options;
        }
        else {
            _extend(this.options, properties);
        }

        return this;
    },

    /**
     * Sets client data
     *
     * screen: window.screen.width + 'x' + window.screen.height,
     * language: window.navigator.browserLanguage || window.navigator.language || "",
     * referer: document.referrer,
     * cookie
     */
    client: function(properties) {
        if (typeof properties === 'undefined') {
            return _extend(this._client, {
                website: this.projectKey,
                app: 'node'
            });
        }
        else {
            _extend(this._client, properties);
        }
    },

    /**
     * Sets visitor properties, does not send a HTTP request to Woopra
     */
    identify: function(id, properties) {
        if (typeof id === 'object') {
            _extend(this._visitor, id);
        }

        else {
            _extend(this._visitor, properties);
            this._visitor.email = id;
        }

        return this;
    },

    /**
     * Identifies a user with Woopra without creating an event
     */
    push: function(cb) {
        return this.request('identify', {} , cb);
    },

    track: function(name, options) {
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

        return this.request('ce', {
            eventData: event
        }, cb);
    },

    /**
     * Clears client data and visitor properties
     */
    reset: function() {
        this.initialize();
    }
};

module.exports = Woopra;
