---
title: How to get clients to move off the old version of your API
authors: josh
tags: [code, api-keys, brownout, api gateway]
description: At Zuplo, we often get asked the question, “How do I move clients off the old version of my API?”. In this post we share techniques we've seen work really well, including using an api gateway for brownouts, for facilitating that transition in a way that works well for you and your clients.
image: ./move-clients-off-old-api.png
---

We recently discussed some best practices for versioning your API with (spoiler) a strong recommendation that you should require that clients indicate the version of the API they were designed for. Go read the [article](https://www.zuplo.com/blog/2022/05/17/how-to-version-an-api) for more details.

I’ve been giving a talk at a few conferences recently about how the world’s fastest-growing companies develop their public API, which included a piece on versioning. One question I commonly get from attendees after the talk is, “How do I move clients off the old version of my API?”, where clients might be internal depts, long-term customers or even teammates who don’t want to change that UI code that is dependent on v1.

In most cases, you can’t just turn off the old version. In the cases above you’ll cause business harm by breaking the marketing department or taking down one of your loyal customers. These folks have priorities and updating to /v2/ of your API is probably not at the top of the list. So how might you create more urgency?

:::note

One of the reasons we strongly recommend requiring the client to indicate the version they were designed for is so that you can continue to maintain multiple versions of your API for as long as you need to. The decision to pressure a customer or department to upgrade is a business decision for you to make. Once you’ve made the call, these techniques can help and are better than just shutting them down one day.

:::

<HubSpotForm region="na1" portalId="21624128" formId="3dfab034-39b8-4728-8193-3ba8018cb1d5"/>

## Creating Urgency

We do not recommend just turning off the API permanently. Instead, you can take the approach of scheduling a ‘brownout’ or timed, temporary downtime. This is where you take the API down during a low-impact period for a short amount of time, maybe at 3 am in the morning, for 2 minutes. This is probably enough to trigger a bunch of alarms and service alerts that make the impact of the upcoming breaking change clear to the consumer.

We’d recommend sharing the schedule of the planned outages so people aren’t surprised at all and know what the glideslope to actual deprecation looks like. Some businesses share that the version of the API they are using will be fully deprecated on a specific date but, knowing that some clients will not upgrade in time, activate the first brownout at this time and notify clients that they have one more week to complete their upgrade. This can you make you appear like you’re being generous, you’re giving them more time than they were told they would have, but they still get the shock of alerts firing.

Another technique to encourage folks to move off an old API, and combines well with brownouts, is to start to add deliberate latency to the old version of the API. You can use an API gateway to do this and, as time progresses, you can increase the latency to multiple seconds even - depending on the use case.

Again, this is a business decision but once you’ve decided you need to create urgency amongst consumers of your soon-to-be-deprecated, old version of your API. This is a better approach to just going dark on active customers on the scheduled date.

We introduced a sleep and brownout policy to Zuplo to make this even easier. If you want to try it out for yourself and schedule a brownout, go sign up at www.zuplo.com/docs/overview/.

**Weekly Zoom Chat**

Are you starting work on, or in the middle of building, a public customer or partner API? Register for our ["Building a Customer API" weekly chat](https://www.zuplo.com/blog/2022/05/18/building-a-customer-api-weekly-chat-utsav-shah-vanta) on Zoom every Thursday at 3pm ET/12pm PT and learn from featured guests and other developers building public APIs.
