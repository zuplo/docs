import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Generate a random number to segment the test groups
  const score = Math.random();

  if (score < 0.5) {
    // Do something for half the requests
  } else {
    // Do something else for the other half
  }

  return request;
}
