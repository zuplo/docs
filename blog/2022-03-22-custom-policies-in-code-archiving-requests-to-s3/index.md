---
title: Custom policies in code, archiving requests to S3 for replay later
authors: josh
tags: [videos, code]
---

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/YqcLu0cXNfE" />

Length: 3 minutes

One of my favorite features of Zuplo is the ability to build custom policies. Here we create a custom policy to archive every request to Amazon's S3 storage. Here's the code in our `archive-request.ts` module:

```ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

type MyPolicyOptionsType = {
  myOption: any;
};
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  context.log.info(environment.AWS_SECRET_ACCESS_KEY);

  const s3Client = new S3Client({ region: "us-east-2" });
  const file = `${Date.now()}-${crypto.randomUUID()}.req.txt`;

  const clone = request.clone();

  const uploadParams = {
    Bucket: "request-storage",
    Key: file,
    Body: await clone.text(),
  };

  const data = await s3Client.send(new PutObjectCommand(uploadParams));

  return request;
}
```

Note, the code above will update S3 in serial with invoking your API, which will increase the latency of your API. However, you can also do this asynchronously, as follows:

```ts
import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

type MyPolicyOptionsType = {
  myOption: any;
};
export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  context.log.info(environment.AWS_SECRET_ACCESS_KEY);

  const s3Client = new S3Client({ region: "us-east-2" });
  const file = `${Date.now()}-${crypto.randomUUID()}.req.txt`;

  const clone = request.clone();

  const uploadParams = {
    Bucket: "request-storage",
    Key: file,
    Body: await clone.text(),
  };

  const dataPromise = s3Client.send(new PutObjectCommand(uploadParams));
  // This tells the runtime to not shutdown until that promise is complete
  context.waitUntil(dataPromise);

  return request;
}
```
