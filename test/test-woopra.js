var http = require('http');
var https = require('https');
var should = require('should');
var sinon = require('sinon');

describe('Woopra', function() {
    var woopra;

    var sslSpy = sinon.spy(https, 'get');
    var spy = sinon.spy(http, 'get');

    beforeEach(function() {
        woopra = require('../index.js');
    });

    afterEach(function() {
        delete require.cache[require.resolve('../index.js')];
        woopra = null;
    });

    describe('Setting configuration and client data', function() {
        it('should set and return configuration object', function() {
            woopra.client().should.not.have.property('domain');

            woopra.config({
                domain: 'test-woopra.com'
            });

            woopra.config().should.have.property('domain', 'test-woopra.com');
        });

        it('should always extend configuration object when called', function() {
            woopra.config({
                domain: 'test-woopra.com'
            });

            woopra.config({
                domain: 'woopra3.com',
                domain2: 'woopra2.com'
            });

            woopra.config().should.have.property('domain', 'woopra3.com');
            woopra.config().should.have.property('domain2', 'woopra2.com');
        });

        it('should return configured `domain` property as a `website` property', function() {
            woopra.config({
                domain: 'test-woopra.com'
            });

            woopra.client().should.have.property('website', 'test-woopra.com');
        });

        it('should set and return client data', function() {
            woopra.client().should.not.have.property('screen');

            woopra.client({
                screen: '100x100'
            });

            woopra.client().should.have.property('screen', '100x100');
        });

        it('should throw an error if domain is not set', function() {
            (function() {
                woopra.push();
            }).should.throw();
        });
    });

    describe('Sending configuration, client, and visitor properties to remote server', function() {
        beforeEach(function() {
            woopra.config({
                domain: 'test-woopra.com'
            });
        });

        it('should send to non-SSL server if configured', function() {
            woopra.config({
                ssl: false
            });

            woopra.identify('test').push();

            sslSpy.called.should.equal(false, 'should not call with SSL');
            spy.called.should.equal(true, 'should call without SSL');

        });

        it('should throw an error if trying to `push` without identifying the visitor', function() {
            (function() {
                woopra.push();
            }).should.throw();
        });

        it('should set and send visitors id/email property', function() {
            woopra.identify('billyid');

            woopra.push();

            sslSpy.calledWithMatch('cv_email=billyid').should.equal(true, 'called with cv_email parameter');
        });

        it('should set and send visitor id/email and custom properties', function() {

            woopra.identify('billyid', {
                gender: 'male'
            }).push();

            sslSpy.calledWithMatch('cv_email=billyid').should.equal(true, 'called with correct email property');
            sslSpy.calledWithMatch('cv_gender=male').should.equal(true, 'called with visitor property: gender');

        });

        it('should send all client data', function() {
            woopra.identify('billyid');

            woopra.client({
                screen: 'screen',
                referer: 'referer'
            });

            woopra.push();

            sslSpy.calledWithMatch('screen=screen').should.equal(true, 'called with screen parameter');
            sslSpy.calledWithMatch('referer=referer').should.equal(true, 'called with referer parameter');
        });

    });

    describe('Sending configuration, client, visitor, and event properties to remote server', function() {
        beforeEach(function() {
            woopra.config({
                domain: 'test-woopra.com'
            });
            woopra.identify('billyid');
        });

        it('should throw an error if trying to `track` without a name parameter', function() {
            (function() {
                woopra.track();
            }).should.throw();

            (function() {
                woopra.track({});
            }).should.throw();
        });

        it('should track an event with no properties', function() {
            woopra.track('test');

            sslSpy.calledWithMatch('name=test').should.equal(true, 'track event name with no properties');
        });

        it('should track an event with properties', function() {
            woopra.track('test', {
                property: true
            });

            sslSpy.calledWithMatch('name=test').should.equal(true, 'track `test` event');
            sslSpy.calledWithMatch('ce_property=true').should.equal(true, 'track `test` event with property `property=true`');

        });
    });

    describe('Reset properties', function() {
        it('should clear client properties after setting them', function() {
            woopra.client({
                screen: 'test'
            });

            woopra.client().should.have.property('screen', 'test');

            woopra.reset();

            woopra.client().should.not.have.property('screen');
        });

        it('should clear visitor properties after setting them', function() {
            woopra.config({
                domain: 'test-woopra.com'
            });

            woopra.identify('test@test-woopra.com', {
                gender: 'male'
            });
            woopra.push();
            sslSpy.calledWithMatch('cv_gender=male').should.equal(true, 'Identify with `gender` property = male (before reset)');

            woopra.reset();

            (function() {
                woopra.push();
            }).should.throw();
        });
    });
});
