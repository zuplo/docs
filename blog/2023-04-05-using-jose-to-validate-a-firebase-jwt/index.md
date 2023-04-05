---
title: Using jose to validate a Firebase JWT token
authors: josh
tags: [auth, jwt, firebase, jose, npm, node, js, ts]
description: Firebase JWT tokens are a little unusual because they don't use secrets or JWKS but have public X509 certs
image: https://og-image.zuplo.com/?text=Using%20jose%20to%20validate%20a%20Firebase%20JWT%20token
---

We're working on adding support for Firebase auth to Zuplo (as we did with Supabase) and in doing so came across their JWT signing approach which is one of the more unusual. They sign their tokens with certs and they publish these certs at a well-known URL: [https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com](https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com).

It took us a while to work out how to validate these JWT tokens using our preferred library: [Jose](https://www.npmjs.com/package/jose).

Hopefully this will save you some time if you're trying to do the same thing. Note that we cache the certs in memory since they do not change often (hopefully!).

```ts
let publicKeys: any;

const getPublicKeys = async () => {
  if (publicKeys) {
    return publicKeys;
  }
  const res = await fetch(
    `https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com`
  );
  publicKeys = await res.json();
  return publicKeys;
};

// This goes
// inside your auth function or middleware

const authHeader = request.headers.get("authorization");
const token = authHeader.substring("bearer ".length);

const firebaseProjectId = "your-project-id";

const verifyFirebaseJwt = async (firebaseJwt) => {
  const publicKeys = await getPublicKeys();
  const decodedToken = await jwtVerify(
    firebaseJwt,
    async (header, _alg) => {
      const x509Cert = publicKeys[header.kid];
      const publicKey = await importX509(x509Cert, "RS256");
      return publicKey;
    },
    {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId,
      algorithms: ["RS256"],
    }
  );
  return decodedToken.payload;
};

// This will throw an
try {
  const tokenData = await verifyFirebaseJwt(token);
  console.log(`We got a valid token`, tokenData);
} catch (err) {
  console.error(`Invalid Token`, err);
}
```

Hope you find that useful. Of course, you could always sign up for a free Zuplo account at [portal.zuplo.com](https://portal.zuplo.com/) and get Firebase JWT auth as easy as configuring a policy 👏 👏 👏
