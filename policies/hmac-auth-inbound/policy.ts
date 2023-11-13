import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  secret: string;
  headerName: string;
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // Validate the policy options
  if (typeof options.secret !== "string") {
    throw new Error(
      `The option 'secret' on policy '${policyName}' must be a string. Received ${typeof options.secret}.`,
    );
  }
  if (typeof options.headerName !== "string") {
    throw new Error(
      `The option 'headerName' on policy '${policyName}' must be a string. Received ${typeof options.headerName}.`,
    );
  }

  // Get the authorization header
  const token = request.headers.get(options.headerName);

  // No auth header, unauthorized
  if (!token) {
    return HttpProblems.unauthorized(request, context);
  }

  // Convert the hex encoded token to an Uint8Array
  const tokenData = new Uint8Array(
    token.match(/../g)!.map((h) => parseInt(h, 16)),
  );

  // Get the data to verify
  // This could be anything (headers, query parameter, etc.)
  // For this example, we will just verify the entire body value
  const data = await request.text();

  // Create a crypto key from a secret stored as an environment variable
  const encoder = new TextEncoder();
  const encodedSecret = encoder.encode(options.secret);
  const key = await crypto.subtle.importKey(
    "raw",
    encodedSecret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // Verify that the data
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    tokenData,
    encoder.encode(data),
  );

  // Check if the data is verified, if not return unauthorized
  if (!verified) {
    return HttpProblems.unauthorized(request, context);
  }

  // Request is authorized, continue
  return request;
}
