const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const config = require("../node_modules/@zuplo/policies/policies.v2.json");

async function updatePolicies() {
  const docsPath = path.resolve(__dirname, "../docs/policies");
  config.policies.forEach((policy) => {
    const docPath = path.join(docsPath, `${policy.id}.md`);
    if (!fs.existsSync(docPath)) {
      const md = `---
title: ${policy.name}
sidebar_label: ${policy.name.replace(" Policy", "")}
---

<!-- Description goes here-->

## Configuration

:::tip

Be sure to read about [policies](/docs/policies)

:::

<PolicyConfig id="${policy.id}" />
`;
      fs.writeFileSync(docPath, md, "utf-8");
    }
  });
}

updatePolicies().catch(console.error);
