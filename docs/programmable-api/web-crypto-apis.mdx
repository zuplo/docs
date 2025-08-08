---
title: Web Crypto
sidebar_label: Web Crypto
original: https://github.com/cloudflare/cloudflare-docs/blob/production/content/workers/runtime-apis/web-crypto.md
license: https://github.com/cloudflare/cloudflare-docs/blob/production/LICENSE
---

<style type="text/css">{`
/* This is here to make the table not scroll on full screen */
table th, table td {
  padding: 6px;
}
`}</style>

The Web Crypto API provides a set of low-level functions for common
cryptographic tasks. The Workers Runtime implements the full surface of this
API, but with some differences in the
[supported algorithms](#supported-algorithms) compared to those implemented in
most browsers.

Performing cryptographic operations using the Web Crypto API is significantly
faster than performing them purely in JavaScript. If you want to perform
CPU-intensive cryptographic operations, you should consider using the Web Crypto
API.

The Web Crypto API is implemented through the `SubtleCrypto` interface,
accessible via the global `crypto.subtle` binding. A simple example of
calculating a digest (also known as a hash) is:

```js
const myText = new TextEncoder().encode("Hello world!");

const myDigest = await crypto.subtle.digest(
  {
    name: "SHA-256",
  },
  myText, // The data you want to hash as an ArrayBuffer
);

console.log(new Uint8Array(myDigest));
```

:::caution

The Web Crypto API differs significantly from Node’s Crypto API. If you want to
port JavaScript code that relies on Node’s Crypto API, you will need to adapt it
to use Web Crypto primitives.

:::

## Methods

### `Crypto.getRandomValues()`

The `Crypto.getRandomValues()` method lets you get cryptographically strong
random values.

[Refer to the MDN documentation for more information](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)

### `Crypto.randomUUID()`

Generates a v4 UUID using a cryptographically secure random number generator.

[Refer to the MDN documentation for more information](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)

```ts
const uuid = crypto.randomUUID();
```

## HMAC Signatures

The following code blocks show how to sign and verify a string using HMAC.

### Sign a Value

```ts
/**
 * Creates a signature for a value and a given secret
 * @param value - The value to check
 * @param secret - the secret
 * @returns The base64 encoded signature
 **/
async function sign(value: string, secret: string) {
  // You will need some super-secret data to use as a symmetric key.
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  // `mac` is an ArrayBuffer, so you need to make a few changes to get
  // it into a ByteString, and then a Base64-encoded string.
  let base64Mac = btoa(String.fromCharCode(...new Uint8Array(mac)));

  // must convert "+" to "-" as urls encode "+" as " "
  base64Mac = base64Mac.replaceAll("+", "-");

  return base64Mac;
}
```

### Verify a Value

```ts
/**
 * Verifies a value against a signature and secret
 * @param signature - The base64 encoded signature
 * @param value - The value to check
 * @param secret - the secret
 * @returns true if the signature is value against the given value and secret
 **/
async function verify(signature: string, value: string, secret: string) {
  // You will need some super-secret data to use as a symmetric key.
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);

  // Convert a ByteString (a string whose code units are all in the range
  // [0, 255]), to a Uint8Array. If you pass in a string with code units larger
  // than 255, their values will overflow.
  function byteStringToUint8Array(byteString) {
    const ui = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; ++i) {
      ui[i] = byteString.charCodeAt(i);
    }
    return ui;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // The received MAC is Base64-encoded, so you have to go to some trouble to
  // get it into a buffer type that crypto.subtle.verify() can read.
  const receivedMac = byteStringToUint8Array(atob(signature));

  // Use crypto.subtle.verify() to guard against timing attacks. Since HMACs use
  // symmetric keys, you could implement this by calling crypto.subtle.sign() and
  // then doing a string comparison -- this is insecure, as string comparisons
  // bail out on the first mismatch, which leaks information to potential
  // attackers.
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    receivedMac,
    encoder.encode(value),
  );

  return verified;
}
```

## Supported algorithms

The runtime implements all operations of the
[WebCrypto standard](https://www.w3.org/TR/WebCryptoAPI/), as shown in the
following table.

A checkmark (✓) indicates that this feature is believed to be fully supported
according to the spec.

An x (✘) indicates that this feature is part of the specification but not
implemented.

If a feature only implements the operation partially, details are listed.

| Algorithm         | sign()<br/>verify() | encrypt()<br/>decrypt() | digest() | deriveBits()<br/>deriveKey() | generateKey() | wrapKey()<br/>unwrapKey() | exportKey() | importKey() |
| :---------------- | :------------------ | :---------------------- | :------- | :--------------------------- | :------------ | :------------------------ | :---------- | :---------- |
| RSASSA PKCS1 v1.5 | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| RSA PSS           | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| RSA OAEP          |                     | ✓                       |          |                              | ✓             | ✓                         | ✓           | ✓           |
| ECDSA             | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| ECDH              |                     |                         |          | ✓                            | ✓             |                           | ✓           | ✓           |
| Ed25519[^1]       | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| X25519[^1]        |                     |                         |          | ✓                            | ✓             |                           | ✓           | ✓           |
| NODE ED25519[^2]  | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| AES CTR           |                     | ✓                       |          |                              | ✓             | ✓                         | ✓           | ✓           |
| AES CBC           |                     | ✓                       |          |                              | ✓             | ✓                         | ✓           | ✓           |
| AES GCM           |                     | ✓                       |          |                              | ✓             | ✓                         | ✓           | ✓           |
| AES KW            |                     |                         |          |                              | ✓             | ✓                         | ✓           | ✓           |
| HMAC              | ✓                   |                         |          |                              | ✓             |                           | ✓           | ✓           |
| SHA 1             |                     |                         | ✓        |                              |               |                           |             |             |
| SHA 256           |                     |                         | ✓        |                              |               |                           |             |             |
| SHA 384           |                     |                         | ✓        |                              |               |                           |             |             |
| SHA 512           |                     |                         | ✓        |                              |               |                           |             |             |
| MD5[^3]           |                     |                         | ✓        |                              |               |                           |             |             |
| HKDF              |                     |                         |          | ✓                            |               |                           |             | ✓           |
| PBKDF2            |                     |                         |          | ✓                            |               |                           |             | ✓           |

[^1]:
    Algorithms as specified in the
    [Secure Curves API](https://wicg.github.io/webcrypto-secure-curves).

[^2]:
    Legacy non-standard EdDSA is supported for the Ed25519 curve in addition to
    the Secure Curves version. Since this algorithm is non-standard, note the
    following while using it:

    - Use `NODE-ED25519` as the algorithm and `namedCurve` parameters.
    - Unlike NodeJS, Cloudflare won't support raw import of private keys.
    - The algorithm implementation may change over time. While Cloudflare can't
      guarantee it at this time, Cloudflare will strive to maintain backward
      compatibility and compatibility with NodeJS's behavior. Any notable
      compatibility notes will be communicated in release notes and via this
      developer documentation.

[^3]:
    MD5 isn't part of the WebCrypto standard but is supported in Cloudflare
    Workers for interacting with legacy systems that require MD5. MD5 is
    considered a weak algorithm. Don't rely upon MD5 for security.
