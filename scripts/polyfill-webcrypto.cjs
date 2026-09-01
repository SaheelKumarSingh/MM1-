/**
 * Vite 5 calls crypto.getRandomValues on the node:crypto module (Node 17.4+).
 * This project still runs Node 16, so patch the singleton before Vite loads.
 */
const crypto = require('crypto');

function getRandomValues(typedArray) {
  if (crypto.webcrypto && typeof crypto.webcrypto.getRandomValues === 'function') {
    return crypto.webcrypto.getRandomValues(typedArray);
  }
  const bytes = crypto.randomBytes(typedArray.byteLength);
  typedArray.set(bytes);
  return typedArray;
}

if (typeof crypto.getRandomValues !== 'function') {
  crypto.getRandomValues = getRandomValues;
}

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.getRandomValues !== 'function'
) {
  globalThis.crypto = crypto.webcrypto || { getRandomValues };
}
