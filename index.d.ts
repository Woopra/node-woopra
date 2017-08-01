/// <reference types="node" />

import * as http from "http";

declare namespace Woopra {
    interface Options {
        /**
         * Use SSL for tracking requests.  SSL is not supported for Basic accounts.  (default: true)
         */
        ssl?: boolean;
    }

    interface Properties {
        /**
         * Note: All event and property names should be lowercase.
         *
         * @param propertyName The name of the custom visitor property
         */
        [propertyName: string]: string | number;
    }

    interface PropertiesWithId extends Properties {
        /**
         * The unique identifier of the visitor.  We highly recommmend you use the email of the visitor in order to get the most out of AppConnect
         */
        id: string;
    }

    interface ClientData {
        /**
         * Visitor's browser's resolution in format of <width>x<height> (i.e. '1024x768')
         */
        screen?: string;

        /**
         * Language of the visitor (i.e. from client-side javascript: window.navigator.language)
         */
        language?: string;

        /**
         * Referrer of visitor (i.e. from client-side javascript: document.referrer)
         */
        referer?: string;

        /**
         * Session ID of the visitor.  Generally this is a cookie value from the browser, but it can be any ID you use to identify the visitor throughout a series of requests.  This should ONLY be used to identify anonymous users, otherwise use `identify()`.
         */
        cookie?: string;

        /**
         * IP Address of the visitor.  (Use `0.0.0.0` if the server is performing an action on behalf of the user (subject to change))
         */
        ip?: string;
    }

    interface TrackOptions {
        timestamp: string;
    }
}

declare class Woopra {
    /**
     * Creates an instance of the Woopra
     *
     * @param key Your project key (generally your website name)
     * @param [options] Configuration options
     */
    constructor(key: string, options?: Woopra.Options)

    /**
     * Sets configuration options
     *
     * @param options Configuration options
     * @returns this instance of Woopra
     */
    config(options: Woopra.Options): Woopra;

    /**
     * Sets visitor properties, does not send a HTTP request to Woopra
     *
     * @param [id] The unique identifier of the visitor.  We highly recommmend you use the email of the visitor in order to get the most out of AppConnect
     * @param properties key/value object for any custom visitor properties you want to associate with the visitor.
     * @returns this instance of Woopra
     */
    identify(id: string, properties: Woopra.Properties): Woopra;

    /**
     * Sets visitor properties, does not send a HTTP request to Woopra
     *
     * @param properties key/value object for any custom visitor properties you want to associate with the visitor.
     * @returns this instance of Woopra
     */
    identify(properties: Woopra.PropertiesWithId): Woopra;

    /**
     * Sets some client configuration values.  These values are similar to custom visitor properties, but handled by Woopra in a different way.
     *
     * @param options key/value object for any custom visitor properties you want to associate with the visitor.
     * @returns this instance of Woopra
     */
    client(options: Woopra.ClientData): Woopra;

    /**
     * Gets the client data
     * @returns The client data
     */
    client(): Woopra.ClientData;

    /**
     * Sends a request to Woopra that only includes any client and visitor data. This can be used to identify a visitor without generating a tracking event.
     *
     * @param [cb] Callback function after the `push` request succeeds
     * @returns The HTTP request object
     */
    push(cb?: (e: Error, res: http.IncomingMessage) => void): http.ClientRequest;

    /**
     * Tracks an event.
     *
     * @param name The name of the event that you want to track
     * @param properties key/value object for any custom event properties to associate with the event
     * @param [options] A tracking options object for specifying a custom timestamp
     * @param [cb] Callback function after the `track` request succeeds
     * @returns The HTTP request object
     */
    track(name: string,
          properties: Woopra.Properties,
          options?: Woopra.TrackOptions,
          cb?: (e: Error, res: http.IncomingMessage) => void): http.ClientRequest;

    track(name: string,
          properties: Woopra.Properties,
          cb: (e: Error, res: http.IncomingMessage) => void): http.ClientRequest;

    /**
     * Clears client data and visitor properties
     */
    reset(): void;
}

export = Woopra;
