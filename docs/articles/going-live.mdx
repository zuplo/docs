---
title: Going Live - Tips
---

We've helped many customers go live with Zuplo from startups launching their
first API to giant, API-first companies moving from Kong, Apigee and the like.
These hot swaps are often the most complicated so here are a few tips for folks
going live on Zuplo. Of course, our enterprise support team is always there to
help so don't hesitate to contact us if you have any questions.

## Observability

One of the most critical things to have ready before going live is
observability. Of course, Zuplo can help with this and we have observability
integrations for Datadog, GCP Cloud Logging, AWS, Loki Grafana and more
([just ask](mailto:support@zuplo.com)) available as part of our enterprise
offerings. Additionally, we have advanced analytics in Zuplo - this is available
for all tiers in working-copy and for as part of an enterprise agreement for
edge deployments.

## Zuplo Advanced Analytics

![Zuplo Analytics](https://storage.googleapis.com/cdn.zuplo.com/uploads/CleanShot%202023-06-10%20at%2017.30.38%402x.png)

Zuplo's built-in analytics (above) can be very useful immediately after a go
live, helping you visualize your response status code mix. The advanced **Top
10** and **Rate Limiting** reports can also help you identify any particular
routes or users that might be experiencing problems.

![Zuplo's Top 10 report](https://storage.googleapis.com/cdn.zuplo.com/uploads/CleanShot%202023-06-10%20at%2017.16.34%402x.png)

As you make changes to configuration you may want to monitor the Primary
analytics report to identify any changes in status code mix that are unexpected.

## Rollback Happens

For large, hot-swap deployments where you already have a high volume of API
traffic that you will be switching to move through Zuplo it is difficult for
teams to have a perfect test setup that models every shape of request. This
means that, on occasion, you might see a spike in errors after going live that
could be due to a bug (often in custom policies or handlers) that weren't
triggered in your test environment.

For this reason, it is important to have an effective and easy rollback strategy
in place. This is often easy to accomplish and most customers use a simple
Virtual IP (VIP) swap that allows an easy configuration change. For instance,
you could keep the DNS entry for your API pointing to your existing
infrastructure and then use a VIP swap to switch traffic over to Zuplo. This
allows you to quickly rollback by simply reverting the VIP swap.

This is adequate for most situations. It is possible to also perform flighting
(sometimes referred to as canary testing, or gradual rollouts), using a traffic
router to slowly shift the % of traffic going through your existing path over to
Zuplo. How to shift traffic could be based on several factors including IP
addresses, geolocation, customer profile, random sampling, special headers, etc.

## Audit Logging

For privacy reasons, Zuplo doesn't log details like the full URL, body or
headers of your request. If you do run into issues in your live environment it
can be useful to have audit logging that logs the **full request**. Most
customers don't wish to log this amount of information permanently so we
recommend enabling/disabling via an
[Environment Variable](./environment-variables.md). In the event of unexpected
errors, this can allow you to capture the full details of the request typically
making for an easier repro.

Ask support@zuplo.com about our available Audit Log plugins. You can also build
your own as outlined [here](./custom-logging-example).

## Health Checks

Ensure you have health checks with endpoints that go through all parts of your
infrastructure, e.g. client -> zuplo -> secure-tunnel -> backend. Enterprise
customers can also request us at Zuplo to monitor your health check endpoints
and we will also monitor them for you as part of our health check (this is a
requirement for some customers that want a high SLA).
