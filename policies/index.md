---
title: Policy Catalog
sidebar_label: Policies
---

import ItemCatalog from '@site/src/components/ItemCatalog';
import policyConfig from '@site/policies.v3.json';

Zuplo includes policies for any solution you need for securing and sharing your API. See the [policy introduction](/docs/overview/policies) to learn about using policies.

<ItemCatalog items={policyConfig.policies.map(({ id, name, icon }) => ({ id, name, icon, href: "/docs/policies/" + id }))} />