---
title: Archive Request to AWS S3 Policy
sidebar_label: Archive Request to AWS S3
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Archive Request to AWS S3

<CustomPolicyNotice name="Archive Request to AWS S3" id="archive-request-aws-s3-inbound" />




<!-- start: intro.md -->
In this example shows how you can archive the body of incoming requests to AWS
S3 Storage. This can be useful for auditing, logging, or archival scenarios.
Additionally, you could use this policy to save the body of a request and then
enqueue some async work that uses this body.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />


## Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

```ts title="modules/archive-request-aws-s3-inbound.ts"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

type PolicyOptions = {
  region: string;
  bucketName: string;
  path: string;
  accessKeyId: string;
  accessKeySecret: string;
};
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // NOTE: policy options should be validated, but to keep the sample short,
  // we are skipping that here.

  // Initialize the S3 client
  const s3Client = new S3Client({
    region: options.region,
    credentials: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.accessKeySecret,
    },
  });

  // Create the file
  const file = `${options.path}/${Date.now()}-${crypto.randomUUID()}.req.txt`;

  // because we will read the body, we need to
  // create a clone of this request first, otherwise
  // there may be two attempts to read the body
  // causing a runtime error
  const clone = request.clone();

  // In this example we assume the body could be text, but you could also
  // request the blob() to handle binary data types like images.
  //
  // This example loads the entire body into memory. This is fine for
  // small payloads, but if you have a large payload you should instead
  // save the body via streaming.
  const body = await clone.text();

  // Create the S3 command
  const command = new PutObjectCommand({
    Bucket: options.bucketName,
    Key: file,
    Body: body,
  });

  // Use the S3 client to save the object
  await s3Client.send(command);

  // Continue the request
  return request;
}

```

## Configuration 

The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.

```json title="config/policies.json"
{
  "name": "my-archive-request-aws-s3-inbound-policy",
  "policyType": "archive-request-aws-s3-inbound",
  "handler": {
    "export": "ArchiveResponseOutbound",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "region": "us-east-1",
      "bucketName": "test-bucket-123.s3.amazonaws.com",
      "path": "responses/",
      "accessKeyId": "$env(AWS_ACCESS_KEY_ID)",
      "accessKeySecret": "$env(AWS_ACCESS_KEY_SECRET)"
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>archive-request-aws-s3-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>default</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(./modules/YOUR_MODULE)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>region</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The AWS region where the bucket is located</p></div></li><li><code>bucketName</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The name of the storage bucket</p></div></li><li><code>path</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The path where requests are stored</p></div></li><li><code>accessKeyId</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The Access Key ID of the account authorized to write to the bucket</p></div></li><li><code>accessKeySecret</code><span class="type-option"> &lt;string&gt;</span> - <div><p>The Access Key Secret of the account authorized to write to the bucket</p></div></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
