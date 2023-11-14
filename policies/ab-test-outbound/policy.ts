import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Generate a random number to segment the test groups
  const score = Math.random();

  // Get the outgoing response body
  const data = await response.json();

  // Modify the body based on the random value
  if (score < 0.5) {
    data.testEnabled = true;
  } else {
    data.testEnabled = false;
  }

  // Stringify the data object
  const body = JSON.stringify(data);

  // Return a new response with the updated body
  return new Response(body, response);
}
