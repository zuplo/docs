---
title: Policy Catalog
sidebar_label: Policies
---

import ItemCatalog from '@site/src/components/ItemCatalog';
import policyConfig from '@site/policies.v3.json';

Zuplo includes policies for any solution you need for securing and sharing your API. See the [policy introduction](/docs/overview/policies) to learn about using policies.

The [CORS policy](/docs/guides/custom-cors-policy) is a special type of policy that is configured separately. Check out details [here](/docs/guides/custom-cors-policy).

<ItemCatalog items={policyConfig.policies.map(({ id, name, icon }) => ({ id, name, icon, href: "/docs/policies/" + id }))} />
