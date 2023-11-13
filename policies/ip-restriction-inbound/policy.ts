import { HttpProblems, ZuploContext, ZuploRequest } from "@zuplo/runtime";
import ipRangeCheck from "ip-range-check";

interface PolicyOptions {
  allowedIpAddresses?: string[];
  blockedIpAddresses?: string[];
}

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: PolicyOptions,
  policyName: string,
) {
  // TODO: Validate the policy options. Skipping in the example for brevity

  // Get the incoming IP address
  const ip = request.headers.get("true-client-ip");

  // If the allowed IP addresses are set, then the incoming IP
  // must be in that list
  if (options.allowedIpAddresses) {
    const allowed = ipRangeCheck(ip, options.allowedIpAddresses);
    if (!allowed) {
      return HttpProblems.unauthorized(request, context);
    }
  }

  // If the blocked IP addresses are set, then the incoming IP
  // cannot be in that list
  if (options.blockedIpAddresses) {
    const blocked = ipRangeCheck(ip, options.allowedIpAddresses);
    if (blocked) {
      return HttpProblems.unauthorized(request, context);
    }
  }

  // If we made it this far, the IP address is allowed, continue
  return request;
}
