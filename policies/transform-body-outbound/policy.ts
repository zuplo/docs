import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  response: Response,
  request: ZuploRequest,
  context: ZuploContext
) {
  // Get the outgoing body as an Object
  const obj = await response.json();

  // Modify the object as required
  obj.myNewProperty = "Hello World";

  // Stringify the object
  const body = JSON.stringify(obj);

  // Return a new response with the new body
  return new Response(body, request);
}
