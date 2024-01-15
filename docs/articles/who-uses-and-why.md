![CleanShot 2024-01-14 at 11 00 12@2x](https://github.com/zuplo/docs/assets/1085573/78b2f755-9d81-4a23-9488-db55aea2f97a)---
title: Who uses Zuplo, and why?
---

We have customers ranging in size from 1-person startups to mature, large
enterprises with many 1000s of employees. All enjoy Zuplo's developer
experience, gitops workflow, support for near unlimited deployments and ease of
extensibility. They also enjoy the built-in analytics and abstraction a gateway
provides as a clean layer of separation in their architecture.

There are a number of reasons people decide to use Zuplo:

### Enterprise Customers

We have many enterprise customers using Zuplo to manage multiple APIs, some
examples include

- [BlockDaemon](https://blockdaemon.com) - the leading infrastructure provider
  for blockchain with an incredible customer list including Goldman Sachs,
  Microsoft, Plaid and many more.
- [Imburse Payments](https://imbursepayments.com) part of
  [Duck Creek Technologies](https://www.duckcreek.com/) - a leading payments
  platform for Insurance companies. See our 🎥 video interview with the Imburse
  team here:
  [▶️ Why Imburse Payments chose Zuplo as their API Gateway](https://youtu.be/z94pRJE2zfs)

### Startup Customers

We also have many smaller businesses using Zuplo, launching a delightful
Stripe-quality experience in record time. Examples include:

- [Rewiring America](https://www.rewiringamerica.org/) - the leading
  electrification nonprofit, focused on electrifying our homes, businesses, and
  communities. We develop accessible, actionable data and tools, and build
  coalitions and partnerships to make going electric easier for households and
  communities. See our 🎥 video interview with the Rewiring America team here:
  [▶️ Tom Carden of Rewiring America on accelerating an API Program with Zuplo](https://youtu.be/wUKLrNIRC_8)

- [iTicket](https://iticket.co.nz) - New Zealand's largest ticketing provider,
  leading a revolution against customers being held to ransom when buying event
  tickets. See our 🎥 video interview with the iTicket team here:
  [▶️ Azure API Management alternative - why iTicket chose Zuplo instead](https://youtu.be/ZWS4x4pwyuo)

- [Common Paper](https://commonpaper.com) - YC-backed startup looking to make
  contracts as clear and programmable as APIs, built on open-source standards.
  See our 🎥 video interview with the iTicket team here:
  [▶️ How Common Paper shipped their API _fast_](https://youtu.be/1rAxJFVXU84)

## Launching a new API

Most of our startup customers are looking to launch an API and want to achieve a
'Stripe-quality' API experience for their customers quickly.

They also want to save time, money and engineering effort and avoid building out
common features like API key authentication, rate-limiting, quotas, request
validation and developer documentation.

API Key authentication is non-trivial to implement and requires writing security
critical code to safely store keys and help customer's self-serve.

Our promise is that Zuplo should be cheaper and faster - than building these
features yourself, while future-proofing your architecture.

## Managing multiple APIs

Most of our larger customers are managing multiple APIs behind Zuplo, including
multiple internal APIs. In some cases combining multiple backends into a single
API but also using Zuplo as a way to ensure that all APIs are using consistent
Authentication, Rate-Limiting and other common policies described by their
internal best practices.

Development teams also prefer Zuplo over other API Management products because
it allows for a more collaborative workflow within the team. Each team can
create as many deployments as necessary for exploration and testing, while
architects and leadership can maintain control over protected branches (QA,
staging, production) with a clean CI/CD integrated workflow.

## Microservices Gateway

Many customers are looking to Zuplo to augment or replace their traditional
microservices gateway as an easier to use, fully-managed solution with built-in
serverless auto-scale. Zuplo might be used to create a single API, with a
programmable orchestration layer hosted on Zuplo.

Some of our customers use Zuplo as a smart-routing layer, with each request
being routed to different, isolated backends based on user credentials or other
metadata. This is covered in this
[video tutorial](https://www.youtube.com/watch?v=SC-HuZqEEPE).

## API over BaaS

Some of our smaller customers are choosing to use Backend-as-a-Service (BaaS)
solutions like supabase, firebase etc and want to use Zuplo as programmable
API-first presentation of their backend. More on this scenario in this
[video guide](https://www.youtube.com/watch?v=GJSkbxMnWxE).
