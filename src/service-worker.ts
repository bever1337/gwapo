/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

// import { clientsClaim } from "workbox-core";
// import { ExpirationPlugin } from "workbox-expiration";
import "workbox-precaching";
// import { registerRoute } from "workbox-routing";
// import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

const ignored = self.__WB_MANIFEST;

export {};
