// common.js 1.0.0
// ----------------------------------------------
// ©2016 Joonas Greis, Kamilla Productions Uninc.
// ES6 common functions and helper scripts for web-service.
// common.js may be freely distributed under the MIT license.

// Base64 Encode Cheat Fix
function base64Decode( str ) {
    str = str.replace(/\s/g, '');
    return decodeURIComponent(encodeURIComponent(window.atob(str)));
}

export { base64Decode };