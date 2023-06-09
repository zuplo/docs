---
title: Turn Firebase Firestore Data into a public or private API
authors: nate
tags: [firestore, data, api]
description: |
  Easily transform Firebase Firestore Data into a public API with both admin and user authorization using Zuplo
image: https://og-image.zuplo.com/?text=Proxy%20Firebase%20Firestore%20Data%20through%20Zuplo
draft: true
---

Recently, we shipped two new policies that make it easy to use Zuplo to utilize
Firebase services. The first policy
[Upstream Firebase Admin Auth](https://zuplo.com/docs/policies/upstream-firebase-admin-auth-inbound)
authorizes requests using a Firebase Admin Token that can be used to call any
Firebase API. The second policy,
[Upstream Firebase User Auth](https://zuplo.com/docs/policies/upstream-firebase-user-auth-inbound)
authorizes requests as a specific user which allows securing Firebase resources
using [security rules](https://firebase.google.com/docs/rules/rules-and-auth).

## Proxy Data using Admin Authentication

It is common for multi-tenant systems to share the same database with many
users. With Firestore, there are several ways to do this - one is create
security rules that grant users access to certain collections, documents, etc.,
the other is to put another system in front of Firestore to gate access to data.
In this section you will learn how to use Zuplo to expose data stored in
Firebase securely without utilizing Firebase's security rules. This can be
useful if your authorization policies are extremely complex or maybe you just
need additional flexibility.

First create a route in Zuplo that uses a
[URL Rewrite](https://zuplo.com/docs/handlers/url-rewrite) handler to map the
incoming request to Firestore's REST API. In this case set the Route's url to
`/products/{id}` and the rewrite value to
`https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT}/databases/(default)/documents/products/${params.id}`

![Products Route](./products-route.png)

Next, in order to give the request access to call the Firestore REST API, add
the **Upstream Firebase Admin Auth** policy. Notice the environment variable
named `SERVICE_ACCOUNT_JSON`.

<Video id="3f11d90de09f5f6e3891ce8164d85d87" />

In order to generate the Firebase API tokens, you will need to set the
`SERVICE_ACCOUNT_JSON` environment variable to the value of the private key from
your Firebase Service Account. Navigate to Firebase **Project Settings**, select
the **Service Accounts** tab and then generate and download a private key.

**CAUTION**: The value of the private key is a JSON file. **Before you save the
file to Zuplo's environment variables**, you must remove all line breaks and all
instances of the `\n` escape character. The JSON file should be a single line.

Next, add the environment variable to your Zuplo project as a secret.

<Video id="f8840dfe93c3f17f064449a1fb028d9e" />
