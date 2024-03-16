---
title: Monetization Glossary
sidebar_label: Glossary
---

:::warning

The monetization feature is currently in beta and is subject to change.

:::

This document contains a list of concepts and terms that are useful to
understand regarding Zuplo's monetization product.

## Stripe Subscription

Subscriptions in Stripe are what register a user to the Product they have
purchased. When a user goes through the checkout process, they will be
registered as a Customer in Stripe with a Subscription. The Subscription will
contain a single Stripe Product.

## Stripe Product

A Stripe product is where the price of your API Plans are specified. Stripe
handles the billing, currency exchange rates, tax calculations, etc. Products in
Stripe match with API Plans.

## API Plan

An API Plan is where you specify the quotas that will be enforced for a
particular user that has purchased access to your API. Plans contain a field
(`External ID`) that is used to reference a Strip Product.

## Metering Service

The Zuplo Metering Service is the service that stores the "API Plan" data and
keeps track of the meters that are consumed within your API.
