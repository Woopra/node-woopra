node-woopra
===========

nodejs library for Woopra



## Installation

```
$ npm install woopra
```


## Usage

```javascript
var Woopra = require('woopra');

var woopra = new Woopra('projectKey');

woopra.identify('user@id.com', {
    visitorProperty: 'property'
}).track('eventName', {
    eventProperty: 'property'
});
```
