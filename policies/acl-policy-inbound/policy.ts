import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";

interface PolicyOptions {
  users: string[];
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // Check that an authenticated user is set
  // NOTE: This policy requires an authentication policy to run before
  if (!request.user) {
    context.log.error(
      "User isn't authenticated. A authorization policy must come before the ACL policy.",
    );
    return HttpProblems.unauthorized(request, context);
  }

  // Check that the user has one of the allowed roles
  if (!options.users.includes(request.user.sub)) {
    context.log.error(
      `The user '${request.user.sub}' isn't authorized to perform this action.`,
    );
    return HttpProblems.forbidden(request, context);
  }

  // If they made it here, they are authorized
  return request;
}
