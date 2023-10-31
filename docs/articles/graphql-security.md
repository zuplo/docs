---
title: Secure your GraphQL API with Zuplo
sidebar_label: Secure your GraphQL API
---

**Secure your GraphQL API with Zuplo**

GraphQL is a powerful query language for your APIs. While it offers great flexibility for clients, it also exposes potential security risks. Fortunately, with Zuplo, you can secure your GraphQL API by implementing various policies. This article walks you through three crucial security policies: "GraphQL Depth Limit", "GraphQL Complexity Limit", and "GraphQL Disable Introspection".

### 1. Understanding the Risks:

#### a. Deeply Nested Queries

Without restrictions, a client can send deeply nested queries that could potentially overwhelm your server, resulting in a Denial of Service (DoS) attack. This is because deeply nested queries can cause the server to process a huge amount of data and operations. While this might be a planed attack, it could also be a mistake by a client who is unaware of the query depth limit.

#### b. Query Complexity

Even without deep nesting, a query can be crafted to be very complex. This could force your server to execute resource-intensive operations, potentially slowing down the system or causing a DoS.

#### c. Introspection

GraphQL allows clients to introspect your schema. While this is beneficial during development, it can expose detailed schema information to potential attackers in production.

### 2. Example Repository

For those who prefer a hands-on approach or wish to see these configurations in action, we've created a GitHub repository with everything set up. This repository offers a comprehensive example of how to configure and secure a GraphQL API using Zuplo. Check out the [GraphQL API with Zuplo example repository](https://github.com/example/Zuplo-GraphQL-Security) to dive deeper.

### 3. Setting Up Zuplo Policies

#### a. GraphQL Depth Limit:

This policy limits how deep a query can be nested.

1. **Setup**:
    - Navigate to the Zuplo dashboard.
    - Under your API settings, select "Policies".
    - Click on "Add Policy" and choose "GraphQL Depth Limit".

2. **Configuration**:
    - Set the maximum allowed depth. For instance, a depth of 5 would allow a query with 5 levels of nesting but block anything deeper.
    - Save your changes.

By limiting the query depth, you prevent malicious or mistakenly deep queries from consuming excessive server resources.

#### b. GraphQL Complexity Limit:

This policy defines a complexity score for each type of operation, and then it limits the total complexity a query can have.

1. **Setup**:
    - Go to the Zuplo dashboard.
    - Under your API settings, select "Policies".
    - Click on "Add Policy" and choose "GraphQL Complexity Limit".

2. **Configuration**:
    - You can assign complexity values to specific fields or use default values.
    - Set a maximum allowed complexity for any single query. Any query exceeding this complexity will be blocked.
    - Save the configurations.

The complexity limit ensures that a potential attacker cannot overload the system by sending overly complicated queries.

#### c. GraphQL Disable Introspection:

Disable introspection in production environments to hide schema details.

1. **Setup**:
    - Navigate to the Zuplo dashboard.
    - Under your API settings, choose "Policies".
    - Click "Add Policy" and select "GraphQL Disable Introspection".

2. **Configuration**:
    - It's simple: just enable the policy.
    - Save your changes.

By disabling introspection in production, you prevent attackers from gaining insights into your GraphQL schema, thereby reducing potential attack vectors.


