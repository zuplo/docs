---
title: How does Zuplo work?
---

Zuplo sits in front of your API to provide security, authentication, caching, rate limiting, and more. If you want to use Zuplo to manage access and use for all callers (internal, partners, customers, etc.) you can put Zuplo in front of all API calls and use Zuplo as a full API Gateway.

<SizedImage
src={require('/static/media/user-zuplo-api.png').default}
alt="Zuplo in front of your API"
maxWidth={600}
/>

Alternatively, you can adopt Zuplo as a partial gateway. In this case, you might want to keep your existing access methods, such as your internal apps calling your API, while using Zuplo to control how your customers or partners use your API.

<SizedImage
src={require('/static/media/app-user-zuplo-api.png').default}
alt="Zuplo in front of your partner API"
maxWidth={620}
/>

### Performance

Zuplo runs on hundreds of data centers worldwide that are close to your users, so your users will see extremely low latency connection times. Zuplo runs on fast and reliable network infrastructure, which often means adding Zuplo in front of your API will decrease the response time for your existing API.

<SizedImage
src={require('/static/media/performance.png').default}
alt="Zuplo performance"
maxWidth={620}
/>

### Scale

Zuplo builds on servers that run in large data centers and massive scale edge locations. Our infrastructure offers unlimited scale for handling millions or billions of requests with ease.

Zuplo can help you scale your existing API to new levels by adding caching and other policies that can dramatically reduce the traffic that actually reaches your endpoints.

<SizedImage
src={require('/static/media/scale.png').default}
alt="Zuplo scale"
maxWidth={700}
/>
