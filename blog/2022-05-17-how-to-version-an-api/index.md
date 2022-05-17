---
title: How to version an API
authors: josh
tags: [code, api-keys]
---



# How to version an API

At some point, you’re going to make an update to your API that would break existing clients if they don’t change their code. That’s OK, change happens.

However, it is critical that you give yourself the option to do two things when this situation arises:

1. Support multiple versions of your API simultaneously (so that you can give older clients the opportunity to migrate to your latest version).
2. Inform a client that the version they have coded for is no longer supported

Life is much easier if you think about versioning from the beginning of the lifecycle of your API. A key decision to make is how you want to design versioning into your API; that is, how should the client communicate the version of the API they are coded to work with?

There are two primary options:

1. **URL-based versioning** - where the version is encoded directly in the URL, e.g. `/v1/charges`. This is the most common approach and is used by most large API-first companies like Stripe, Twilio, SendGrid and Airtable. 
2. **Header-based versioning** - where the version is in a header; either a customer header like `api-version: v3` or as part of the accept header, e.g. `accept: application/vnd.example+json;version=1.0`. 

## Our recommendations

**1/ Keep those options open**

First and foremost, we **strongly recommend** that you make the version a mandatory part of all requests received by your API. So any request that doesn’t include the version should receive a 4xx error code (400 if it’s a required header, 404 if it is missing from the URL). 

This is the most important decision because it means you always have both options outlined at the opening of this post. 

**2/ Keep it simple**

After this, we recommend URL-based versioning. There is plenty of precedent in the market and it’s the easiest for developers to use - it’s easier to test with CURL, call with fetch, test in a browser if you support GET requests. It’s just easier.

**3/ Use headers if you’re passionate about building a *pure* REST implementation**

The primary reason to use headers over URL-based versioning is to avoid violating a REST principle that states a URI should refer to a unique resource (`v1/foo` and `v2/foo` could theoretically point to the same resource). However, such pure implementations of REST APIs have not proven popular and are trickier for developers to use. 

**4/ Don’t break rule 1**

There are examples of APIs in the public domain that have a default version if the client doesn’t specify a version. Here’s GitHub’s documentation on their API:

![Github version documentation](How%20to%20version%20an%20API%20df1d0cdff9c54a3598f308c32791cabf/Untitled.png)

Even though it encourages developers to use the version header, the API still works without it and just assumes v3. We think this is a mistake; if GitHub upgrades to v4 and that becomes the new default, all of those old clients that didn’t follow the best practice will experience unpredictable behavior and strange errors.