---
title: Use Firestore Data as a User Authenticated API
authors: nate
tags: [firestore, data, api]
description: |
  Easily transform Firebase Firestore Data into a user-authenticated API using Firebase.
image: https://og-image.zuplo.com/?text=Turn%20Firebase%20Firestore%20Data%20into%20a%20simple%20REST%20API
---

Recently, we shipped two new policies that make it easy to use Zuplo to utilize
Firebase services. The first policy
[Upstream Firebase Admin Auth](https://zuplo.com/docs/policies/upstream-firebase-admin-auth-inbound)
authorizes requests using a Firebase Admin Token that can be used to call any
Firebase API. The second policy,
[Upstream Firebase User Auth](https://zuplo.com/docs/policies/upstream-firebase-user-auth-inbound)
authorizes requests as a specific user which allows securing Firebase resources
using [security rules](https://firebase.google.com/docs/rules/rules-and-auth).
