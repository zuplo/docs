import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  blobContainerPath: string;
  blobCreateSas: string;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string
) {
  // NOTE: policy options should be validated, but to keep the sample short,
  // we are skipping that here.

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

  // generate a unique blob name based on the date and requestId
  const blobName = `${Date.now()}-${context.requestId}.req.txt`;

  const url = `${options.blobContainerPath}/${blobName}?${options.blobCreateSas}`;

  const result = await fetch(url, {
    method: "PUT",
    body: body,
    headers: {
      "x-ms-blob-type": "BlockBlob",
    },
  });

  if (result.status > 201) {
    const text = await result.text();
    context.log.error("Error saving file to storage", text);
    return HttpProblems.internalServerError(request, context, {
      detail: text,
    });
  }

  // continue
  return request;
}
