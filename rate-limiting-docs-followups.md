# Rate Limiting Docs — Followups

Generated from a dual-perspective (junior dev + staff engineer) gap review of
the rate limiting documentation on `feat/add-rate-limiting-section`.

**Status of this document**

- Tier 1 items have been implemented on this branch. See the commit alongside
  this file for the changes.
- Tier 2 and Tier 3 below are _not_ implemented and are parked here for future
  work. Many of them depend on information from runtime engineers (consistency
  model, cardinality limits, latency numbers, etc.) rather than on writing
  alone.

Files in scope for the review (policy reference pages were explicitly excluded):

- `docs/rate-limiting/getting-started.mdx` (absorbed the former
  `docs/rate-limiting/overview.mdx` during the IA/tech-writer restructure — see
  below)
- `docs/rate-limiting/dynamic-rate-limiting.mdx`
- `docs/rate-limiting/combining-policies.mdx`
- `docs/rate-limiting/monitoring-and-troubleshooting.mdx`
- `docs/rate-limiting/how-it-works.md` (moved from
  `docs/concepts/rate-limiting.md`)
- `docs/rate-limiting/per-user-rate-limits-using-db.mdx` (moved from
  `docs/articles/per-user-rate-limits-using-db.mdx`)
- `docs/errors/rate-limit-exceeded.mdx`

---

## Tier 2 — New technical content (needs SME input)

These are claims the docs currently make without substantiating. Each item
likely requires a conversation with the runtime team before it can be written
honestly.

### 1. Distributed-system semantics in `docs/rate-limiting/how-it-works.md`

The docs assert that rate limits are "enforced globally across all edge
locations" but never explain the mechanism. A new section should cover:

- Consistency model of the global counter (eventual vs. strong).
- How counters are aggregated across regions / edge POPs.
- Behaviour at window boundaries under replication (the double-burst problem).
- Clock handling — server time vs. client time, tolerance for clock skew.
- What happens if a region / POP is unreachable (counter divergence, failover).
- Whether a caller can "escape" a limit by switching regions.
- Maximum distinct keys (cardinality) before performance degrades. Is there a
  soft limit, a hard cap, or eviction behaviour?

### 2. Quantify strict-mode latency and async-mode overshoot

- `rate-limiting/how-it-works.md` says strict mode "adds some latency to every
  request because the check hits a globally distributed rate limit service"
  without numbers. Needs a typical p50/p99 figure, and whether it varies by
  region.
- `monitoring-and-troubleshooting.mdx` gives "approximately one extra request
  may slip through per window" for async mode at 100 req/s and 10 ms of latency.
  That needs to be expressed as a worst-case formula (e.g.
  `overshoot ≈ rate × check_latency`) so readers can reason about their own
  numbers, not just the example.

### 3. ZoneCache vs. rate-limit-window race in the DB guide

In `docs/rate-limiting/per-user-rate-limits-using-db.mdx`, the ZoneCache TTL is
60 seconds and the limit window is 1 minute. Add:

- A sequence diagram showing a tier change mid-window and which limit applies.
- Concurrency notes: what happens if two Zuplo instances both miss the cache and
  query the database?
- Guidance on acceptable staleness — if a customer's tier changes, how long
  until the new tier is enforced?
- Connection pooling / query timeout / circuit breaker recommendations for the
  database call.
- Cardinality guidance — how many distinct keys can this pattern support?

### 4. Reframe `throwOnFailure` as an architectural decision

Currently `throwOnFailure` is documented as a boolean with "`false` is safer".
This is an availability-vs.-correctness choice:

- Fail-open means DoS traffic bypasses rate limiting during an outage.
- Fail-closed means a rate-limit-service outage takes down every rate-limited
  route.

Rewrite the option description in `monitoring-and-troubleshooting.mdx` (and link
from the policy reference) to present it as a decision with explicit
consequences, and recommend how to monitor for a silent fail-open condition.

### 5. Standards-compliant response headers

Add to `docs/errors/rate-limit-exceeded.mdx`:

- Whether Zuplo emits IETF draft
  [`RateLimit-*`](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/)
  headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`), only
  `Retry-After`, or both.
- Explicit RFC citations: RFC 6585 for `429`, RFC 7231 for `Retry-After` format
  (delay-seconds vs. HTTP-date), RFC 9457 for the Problem Details body.

---

## Tier 3 — New pages

### 6. "Rate Limit Deployment & Rollout" guide

Should cover:

- Observe-only / dry-run mode — how to log rejections without enforcing.
- Canary rollout — applying new limits to a subset of traffic first.
- Rollback procedures when a limit change causes incidents.
- Per-environment testing (preview → production) and per-region verification
  when the limit or dynamic function varies by environment.

### 7. "Observability Checklist" in `monitoring-and-troubleshooting.mdx`

A concrete, copy-paste-ready section that lists:

- The exact metrics to export to an external logging / metrics platform
  (rejected count, overage count, per-key histogram, window-usage distribution).
- Sample queries for "top 10 keys approaching their limit" and "region with
  highest rejection rate".
- Alert recipes for a silent fail-open condition and for async-mode overshoot
  exceeding an acceptable threshold.

### 8. "Common Mistakes" checklist at the end of `combining-policies.mdx`

A short checklist covering:

- Forgetting to attach a policy to a route.
- Policy name typos between `policies.json` and `routes.oas.json` (silent
  failure).
- Ordering: short window before long window (wastes counter writes).
- `rateLimitBy: "user"` without an auth policy earlier in the pipeline.
- Accidental shared counters across unrelated routes (already covered but could
  be expanded).

---

## Out of scope for now (captured so we don't lose them)

- **Security considerations** — enumeration attacks via 429 timing, rate-limit
  bypass via header injection, amplification attacks against the rate-limit
  service itself, shared-counter exhaustion as a multi-tenant concern. These
  belong in a dedicated security section and need a security review.
- **Monetization + rate-limit period-boundary behaviour** — what happens when a
  monthly quota rolls over while a rate limit window is still active? Needs a
  call with the monetization team to answer accurately.
