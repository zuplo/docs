---
title: Use Firestore Data as a User Authenticated API
authors: nate
tags: [firestore, data, api]
description: |
  Easily transform Firebase Firestore Data into a user-authenticated API using Firebase.
image: https://og-image.zuplo.com/?text=Use%20Firestore%20Data%20as%20a%20User%20Authenticated%20API
draft: true
---

This post demonstrates how to enable a user-authenticated API that is proxied
through Zuplo to securely read and write data to a Firebase Firestore Database.
It will show how to use the
[Upstream Firebase User Auth](https://zuplo.com/docs/policies/upstream-firebase-user-auth-inbound)
policy to authorize users to make requests to Firebase and how to use Firebase
[security rules](https://firebase.google.com/docs/rules/rules-and-auth) to
ensure users access only authorized data. It will also demonstrate how to use
Zuplo API Key authenticate to authenticate requests to the Zuplo API.

### 1/ Firestore Collection

For this demo, we'll create a bookmark saving API that lets users save a
collection of URLs with a note for each URL. We'll also save the date each
bookmark was created.
