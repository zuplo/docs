---
title:
  Imburse Payments - delivering the optimum API experience for our customers and
  workflow for our team
authors: josh
tags: [price, cost, api, api, azure]
description: |
  Imburse Payments, a UK fintech, selected Zuplo over Azure API Management to optimize the API experience for their customers and have the best workflow for their engineering team
image: https://og-image.zuplo.com/?text=Imburse%20choose%20Zuplo%20over%20Azure%20API%20Mgmt
---

> "Zuplo has really delivered. We’re an API-first company... We have great
> performance. We have great observability. It fits with our platform.” -
> **James World, System Architect at Imburse**

[Imburse Payments](https://imbursepayments.com/) are a leading payments
middleware provider for the insurance market. As an API-first company, their
choice of API gateway is a critical decision. Recently, I got to interview
[James World, System Architect](https://www.linkedin.com/in/james-world-08a55a1/),
and (Andrew Withers, SRE at
Imburse)[https://www.linkedin.com/in/andrew-withers-3a651096/], about their
decision-making process that led to them going live with Zuplo.

Imburse primarily used Microsoft Azure as their cloud and hosting provider and
so their default choice is to use services provided by Microsoft, in this case,
they looked at Azure API Management (founded by
[me, Zuplo’s CEO](https://www.linkedin.com/in/joshtwist/) when I worked at
Microsoft) but decided that Zuplo was a better fit for their needs.

They highlighted several motivations for them in looking for a gateway and
making the final decision to use Zuplo. They have a modern, microservice-based
architecture and had been using the common approach of routing requests based on
embedded Kubernetes features, but realized it was time to “up their game” and
add rate-limiting and a cleaner, more consistent way of implementing security,
authentication, and observability.

James and team are passionate about the developer workflow and invest heavily in
having an optimum workflow that supports their agile approach. “We're able to
make changes very quickly. And so we've always taken the approach of having an
automated deployment pipeline, from that first push all the way through to
automated testing and getting things into production. Our goal is that we are
able to get changes into production, ideally within minutes.” said James, “If
the tool can't support that goal, then we don't like it.”.

Andrew added, “It’s very important for us to follow a GitOps approach to
deployment. We tried to use Azure API Management, and it was far more
challenging than it needed to be — most gateways just don’t lend themselves well
to this approach. When we saw how Zuplo worked and how clean it would be, it was
a bit of a blessing.”

Imburse are also making heavy use of Zuplo’s native programmability — “I was
able to put together prototypes of custom policies and custom rate-limiting
algorithms and test them in literally minutes.” notes Andrew. “We actually have
three levels of rate-limiting now - a custom rate limiter for users who are
coming in through an authenticated flow where we can identify the organization
that they work for. A fallback for a different type of authenticated user, and
then we have another fallback for IP-based rate limiting. So even our anonymous
methods are being rate limited now.”

They also care deeply about observability, and it was important that their
chosen solution would work well with their preferred observability platform —
Datadog.

“We wanted a holistic view of our estate, and we didn’t have that before Zuplo.
if we wanted to look at calls coming into different parts of the system, we
would have to go into individual services and go query those individually. By
sort of introducing Zuplo and adding in the Datadog plugin, we were then able to
create views that showed us all requests across all APIs in one view, which was
really powerful. Really important. It allows us to very quickly pinpoint errors
and spot problems as they're happening. It also allows us to get insights into
some of the API design decisions that have been made over the years. So we're
sort of starting to see patterns that we maybe wouldn't have spotted before”,
notes Andrew,”It has really helped me in my role as a Site Reliability
Engineer - given me lots to focus on!”

“Zuplo has really delivered. We’re an API-first company, and it's absolutely
vital that our customers understand how our product works. They have to have a
clear understanding of the APIs, they have to have confidence that what our
documentation says those APIs do and how they work is actually how they work. So
the fact we're able to tie our documentation, our specifications, and how we do
deployment all together means that we can really nail that consistency. We have
great performance. We have great observability. It fits with our platform.”

Check out the
[video interview with James and Andrew](https://youtu.be/z94pRJE2zfs):

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/z94pRJE2zfs" />
