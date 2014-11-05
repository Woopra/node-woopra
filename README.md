node-woopra ![Travis CI](https://travis-ci.org/Woopra/node-woopra.svg?branch=master)
===========

nodejs library for Woopra



## Installation

```
$ npm install woopra
```


## Usage

```javascript
var Woopra = require('woopra');
 
// Replace projectKey with your project key (generally your website name)
// `options` is an object, currently the only option supported is ssl: <true|false> (default: true)
var woopra = new Woopra('projectKey', options);
```

You can configure the tracker after initialization by calling `config(properties)`

```javascript
woopra.config({
    ssl: true
});
```

You *must* identify your users before tracking. Use the `identify(uid, properties)` method to attach a unique ID (we highly recommend using e-mails to get the most out of AppConnect), as well as other visitor properties.

Your custom visitor data will not be pushed until you send your first custom event. In order to push your identify without sending a custom event, use the `push` method.

```javascript
woopra.identify('user@id.com', {
    visitorProperty: 'property'
}).push();
```

To send a custom event, use `track(eventName, properties)`

```javascript
woopra.track('eventName', {
    eventProperty: 'property'
});
```

Track event accepts an optional callback with error and HTTP response code parameters

```javascript
woopra.track('eventName', {
    eventProperty: 'property'
}, function(err, responseCode) {
	if(err) throw err;
	console.log(responseCode); //200 if OK
});
```

## Methods

## .config(options)
Sets some configuration options.

* `options` - object with the following available keys:

 key    | type   | description
 ------ | ------ | -----------
ssl | boolean | Use SSL for tracking requests.  SSL is not supported for Basic accounts.  (default: true)

## .client(options)
Sets some client configuration values.  These values are similar to custom visitor properties, but handled by Woopra in a different way.

* `options` - object with the following keys:

 key    | type   | description
 ------ | ------ | -----------
 screen | string | Visitor's browser's resolution in format of `<width>x<height>` (i.e. '1024x768')
language | string | Language of the visitor (i.e. from client-side javascript: window.navigator.language)
referer | string | Referrer of visitor (i.e. from client-side javascript: document.referrer)
cookie | string | Session ID of the visitor.  Generally this is a cookie value from the browser, but it can be any ID you use to identify the visitor throughout a series of requests.  This should ONLY be used to identify anonymous users, otherwise use `identify()`.
ip | string | IP Address of the visitor.  (Use `0.0.0.0` if the server is performing an action on behalf of the user (subject to change))

## .identify(id, properties)
Sets visitor properties for the current visitor.  Does not send the properties unless `track` or `push` is called.  Returns an instance of the tracker so that you can chain methods.

* `id` - The unique identifier of the visitor.  We highly recommmend you use the email of the visitor in order to get the most out of AppConnect
* `properties` - key/value object for any custom visitor properties you want to associate with the visitor. 

## .push()
Sends a request to Woopra that only includes any client and visitor data.  This can be used to identify a visitor without generating a tracking event.

## .track(eventName, properties, callback)
Tracks an event.

* `eventName` - The name of the event that you want to track
* `properties` - key/value object for any custom event properties to associate with the event
* `callback` - Callback function after the `track` request succeeds.


