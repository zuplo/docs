const sidebars = {
  referenceSidebar: [
    {
      type: "category",
      label: "@zuplo/runtime",
      link: { type: "doc", id: "runtime" },
      items: [
        {
          type: "doc",
          label: "ApiAuthKeyInboundPolicy",
          id: "runtime.apiauthkeyinboundpolicy",
        },
        {
          type: "category",
          label: "ApiAuthKeyInboundPolicyOptions",
          link: { type: "doc", id: "runtime.apiauthkeyinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "allowUnauthenticatedRequests",
              id: "runtime.apiauthkeyinboundpolicyoptions.allowunauthenticatedrequests",
            },
            {
              type: "doc",
              label: "authHeader",
              id: "runtime.apiauthkeyinboundpolicyoptions.authheader",
            },
            {
              type: "doc",
              label: "authScheme",
              id: "runtime.apiauthkeyinboundpolicyoptions.authscheme",
            },
            {
              type: "doc",
              label: "key\\_validator\\_api\\_url",
              id: "runtime.apiauthkeyinboundpolicyoptions.key_validator_api_url",
            },
          ],
        },
        {
          type: "category",
          label: "ApiKeyValidationResult",
          link: { type: "doc", id: "runtime.apikeyvalidationresult" },
          items: [
            {
              type: "doc",
              label: "isValid",
              id: "runtime.apikeyvalidationresult.isvalid",
            },
            {
              type: "doc",
              label: "metadata",
              id: "runtime.apikeyvalidationresult.metadata",
            },
          ],
        },
        {
          type: "doc",
          label: "Auth0JwtInboundPolicy",
          id: "runtime.auth0jwtinboundpolicy",
        },
        {
          type: "category",
          label: "Auth0JwtInboundPolicyOptions",
          collapsed: true,
          link: { type: "doc", id: "runtime.auth0jwtinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "allowUnauthenticatedRequests",
              id: "runtime.auth0jwtinboundpolicyoptions.allowunauthenticatedrequests",
            },
            {
              type: "doc",
              label: "audience",
              id: "runtime.auth0jwtinboundpolicyoptions.audience",
            },
            {
              type: "doc",
              label: "auth0Domain",
              id: "runtime.auth0jwtinboundpolicyoptions.auth0domain",
            },
          ],
        },
        {
          type: "doc",
          label: "awsLambdaHandler",
          id: "runtime.awslambdahandler",
        },
        {
          type: "category",
          label: "BadRequestResponse",
          link: { type: "doc", id: "runtime.badrequestresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.badrequestresponse._constructor_",
            },
          ],
        },
        {
          type: "doc",
          label: "BasicAuthInboundPolicy",
          id: "runtime.basicauthinboundpolicy",
        },
        {
          type: "category",
          label: "BasicAuthInboundPolicyOptions",
          link: { type: "doc", id: "runtime.basicauthinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "accounts",
              id: "runtime.basicauthinboundpolicyoptions.accounts",
            },
            {
              type: "doc",
              label: "allowUnauthenticatedRequests",
              id: "runtime.basicauthinboundpolicyoptions.allowunauthenticatedrequests",
            },
          ],
        },
        {
          type: "doc",
          label: "BasicRateLimitInboundPolicy",
          id: "runtime.basicratelimitinboundpolicy",
        },
        {
          type: "category",
          label: "BasicRateLimitInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.basicratelimitinboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "additionalOptions",
              id: "runtime.basicratelimitinboundpolicyoptions.additionaloptions",
            },
            {
              type: "doc",
              label: "export",
              id: "runtime.basicratelimitinboundpolicyoptions.export",
            },
            {
              type: "doc",
              label: "identifier",
              id: "runtime.basicratelimitinboundpolicyoptions.identifier",
            },
            {
              type: "doc",
              label: "rateLimitBy",
              id: "runtime.basicratelimitinboundpolicyoptions.ratelimitby",
            },
            {
              type: "doc",
              label: "requestsAllowed",
              id: "runtime.basicratelimitinboundpolicyoptions.requestsallowed",
            },
            {
              type: "doc",
              label: "timeWindowMinutes",
              id: "runtime.basicratelimitinboundpolicyoptions.timewindowminutes",
            },
          ],
        },
        {
          type: "doc",
          label: "ChangeMethodInboundPolicy",
          id: "runtime.changemethodinboundpolicy",
        },
        {
          type: "category",
          label: "ChangeMethodInboundPolicyOptions",
          link: { type: "doc", id: "runtime.changemethodinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "method",
              id: "runtime.changemethodinboundpolicyoptions.method",
            },
          ],
        },
        {
          type: "doc",
          label: "ClearHeadersInboundPolicy",
          id: "runtime.clearheadersinboundpolicy",
        },
        {
          type: "category",
          label: "ClearHeadersInboundPolicyOptions",
          link: { type: "doc", id: "runtime.clearheadersinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "exclude",
              id: "runtime.clearheadersinboundpolicyoptions.exclude",
            },
          ],
        },
        {
          type: "doc",
          label: "CognitoJwtInboundPolicy",
          id: "runtime.cognitojwtinboundpolicy",
        },
        {
          type: "category",
          label: "CognitoJwtInboundPolicyOptions",
          link: { type: "doc", id: "runtime.cognitojwtinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "allowUnauthenticatedRequests",
              id: "runtime.cognitojwtinboundpolicyoptions.allowunauthenticatedrequests",
            },
            {
              type: "doc",
              label: "region",
              id: "runtime.cognitojwtinboundpolicyoptions.region",
            },
            {
              type: "doc",
              label: "userPoolId",
              id: "runtime.cognitojwtinboundpolicyoptions.userpoolid",
            },
          ],
        },
        {
          type: "category",
          label: "CreatedResponse",
          link: { type: "doc", id: "runtime.createdresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.createdresponse._constructor_",
            },
          ],
        },
        {
          type: "category",
          label: "CustomRateLimitPolicyOptions",
          link: { type: "doc", id: "runtime.customratelimitpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "key",
              id: "runtime.customratelimitpolicyoptions.key",
            },
            {
              type: "doc",
              label: "requestsAllowed",
              id: "runtime.customratelimitpolicyoptions.requestsallowed",
            },
            {
              type: "doc",
              label: "timeWindowMinutes",
              id: "runtime.customratelimitpolicyoptions.timewindowminutes",
            },
          ],
        },
        {
          type: "category",
          label: "DefaultErrorPayload",
          link: { type: "doc", id: "runtime.defaulterrorpayload" },
          items: [
            {
              type: "doc",
              label: "code",
              id: "runtime.defaulterrorpayload.code",
            },
            {
              type: "doc",
              label: "help\\_url",
              id: "runtime.defaulterrorpayload.help_url",
            },
            {
              type: "doc",
              label: "message",
              id: "runtime.defaulterrorpayload.message",
            },
          ],
        },
        { type: "doc", label: "ErrorHandler", id: "runtime.errorhandler" },
        {
          type: "category",
          label: "ForbiddenResponse",
          link: { type: "doc", id: "runtime.forbiddenresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.forbiddenresponse._constructor_",
            },
          ],
        },
        {
          type: "doc",
          label: "FormDataToJsonInboundPolicy",
          id: "runtime.formdatatojsoninboundpolicy",
        },
        {
          type: "category",
          label: "FormDataToJsonInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.formdatatojsoninboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "badRequestIfNotFormData",
              id: "runtime.formdatatojsoninboundpolicyoptions.badrequestifnotformdata",
            },
            {
              type: "doc",
              label: "optionalHoneypotName",
              id: "runtime.formdatatojsoninboundpolicyoptions.optionalhoneypotname",
            },
          ],
        },
        {
          type: "doc",
          label: "InboundPolicyHandler",
          id: "runtime.inboundpolicyhandler",
        },
        {
          type: "category",
          label: "InternalErrorResponse",
          link: { type: "doc", id: "runtime.internalerrorresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.internalerrorresponse._constructor_",
            },
          ],
        },
        {
          type: "category",
          label: "Logger",
          link: { type: "doc", id: "runtime.logger" },
          items: [
            { type: "doc", label: "debug", id: "runtime.logger.debug" },
            { type: "doc", label: "error", id: "runtime.logger.error" },
            { type: "doc", label: "info", id: "runtime.logger.info" },
            { type: "doc", label: "log", id: "runtime.logger.log" },
            { type: "doc", label: "warn", id: "runtime.logger.warn" },
          ],
        },
        { type: "doc", label: "LogLevel", id: "runtime.loglevel" },
        {
          type: "category",
          label: "MethodNotAllowedResponse",
          link: { type: "doc", id: "runtime.methodnotallowedresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.methodnotallowedresponse._constructor_",
            },
          ],
        },
        {
          type: "category",
          label: "NotFoundResponse",
          link: { type: "doc", id: "runtime.notfoundresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.notfoundresponse._constructor_",
            },
          ],
        },
        {
          type: "category",
          label: "OKResponse",
          link: { type: "doc", id: "runtime.okresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.okresponse._constructor_",
            },
          ],
        },
        {
          type: "doc",
          label: "OpenIdJwtInboundPolicy",
          id: "runtime.openidjwtinboundpolicy",
        },
        {
          type: "category",
          label: "OpenIdJwtInboundPolicyOptions",
          link: { type: "doc", id: "runtime.openidjwtinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "allowUnauthenticatedRequests",
              id: "runtime.openidjwtinboundpolicyoptions.allowunauthenticatedrequests",
            },
            {
              type: "doc",
              label: "audience",
              id: "runtime.openidjwtinboundpolicyoptions.audience",
            },
            {
              type: "doc",
              label: "issuer",
              id: "runtime.openidjwtinboundpolicyoptions.issuer",
            },
            {
              type: "doc",
              label: "jwkUrl",
              id: "runtime.openidjwtinboundpolicyoptions.jwkurl",
            },
          ],
        },
        {
          type: "category",
          label: "PayloadResponseInit",
          link: { type: "doc", id: "runtime.payloadresponseinit" },
          items: [
            {
              type: "doc",
              label: "status",
              id: "runtime.payloadresponseinit.status",
            },
            {
              type: "doc",
              label: "statusText",
              id: "runtime.payloadresponseinit.statustext",
            },
          ],
        },
        {
          type: "category",
          label: "PermanentRedirectResponse",
          link: { type: "doc", id: "runtime.permanentredirectresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.permanentredirectresponse._constructor_",
            },
          ],
        },
        {
          type: "doc",
          label: "RemoveHeadersInboundPolicy",
          id: "runtime.removeheadersinboundpolicy",
        },
        {
          type: "category",
          label: "RemoveHeadersInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.removeheadersinboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "headers",
              id: "runtime.removeheadersinboundpolicyoptions.headers",
            },
          ],
        },
        {
          type: "doc",
          label: "RemoveQueryParamsInboundPolicy",
          id: "runtime.removequeryparamsinboundpolicy",
        },
        {
          type: "category",
          label: "RemoveQueryParamsInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.removequeryparamsinboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "params",
              id: "runtime.removequeryparamsinboundpolicyoptions.params",
            },
          ],
        },
        {
          type: "doc",
          label: "RequestSizeLimitInboundPolicy",
          id: "runtime.requestsizelimitinboundpolicy",
        },
        {
          type: "category",
          label: "RequestSizeLimitInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.requestsizelimitinboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "maxSizeInBytes",
              id: "runtime.requestsizelimitinboundpolicyoptions.maxsizeinbytes",
            },
            {
              type: "doc",
              label: "trustContentLengthHeader",
              id: "runtime.requestsizelimitinboundpolicyoptions.trustcontentlengthheader",
            },
          ],
        },
        {
          type: "category",
          label: "RequestUser",
          link: { type: "doc", id: "runtime.requestuser" },
          items: [
            { type: "doc", label: "data", id: "runtime.requestuser.data" },
            { type: "doc", label: "sub", id: "runtime.requestuser.sub" },
          ],
        },
        {
          type: "category",
          label: "ResponseFactory",
          link: { type: "doc", id: "runtime.responsefactory" },
          items: [
            {
              type: "doc",
              label: "badRequest",
              id: "runtime.responsefactory.badrequest",
            },
            {
              type: "doc",
              label: "created",
              id: "runtime.responsefactory.created",
            },
            {
              type: "doc",
              label: "forbidden",
              id: "runtime.responsefactory.forbidden",
            },
            {
              type: "doc",
              label: "internalError",
              id: "runtime.responsefactory.internalerror",
            },
            {
              type: "doc",
              label: "methodNotAllowed",
              id: "runtime.responsefactory.methodnotallowed",
            },
            {
              type: "doc",
              label: "notFound",
              id: "runtime.responsefactory.notfound",
            },
            { type: "doc", label: "ok", id: "runtime.responsefactory.ok" },
            {
              type: "doc",
              label: "permanentRedirect",
              id: "runtime.responsefactory.permanentredirect",
            },
            {
              type: "doc",
              label: "temporaryRedirect",
              id: "runtime.responsefactory.temporaryredirect",
            },
            {
              type: "doc",
              label: "unauthorized",
              id: "runtime.responsefactory.unauthorized",
            },
          ],
        },
        { type: "doc", label: "RouteHandler", id: "runtime.routehandler" },
        {
          type: "category",
          label: "ServiceProvider",
          link: { type: "doc", id: "runtime.serviceprovider" },
          items: [
            {
              type: "doc",
              label: "addService",
              id: "runtime.serviceprovider.addservice",
            },
            {
              type: "doc",
              label: "getService",
              id: "runtime.serviceprovider.getservice",
            },
          ],
        },
        {
          type: "doc",
          label: "SetHeadersInboundPolicy",
          id: "runtime.setheadersinboundpolicy",
        },
        {
          type: "category",
          label: "SetHeadersInboundPolicyOptions",
          link: { type: "doc", id: "runtime.setheadersinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "headers",
              id: "runtime.setheadersinboundpolicyoptions.headers",
            },
          ],
        },
        {
          type: "doc",
          label: "SetQueryParamsInboundPolicy",
          id: "runtime.setqueryparamsinboundpolicy",
        },
        {
          type: "category",
          label: "SetQueryParamsInboundPolicyOptions",
          link: {
            type: "doc",
            id: "runtime.setqueryparamsinboundpolicyoptions",
          },
          items: [
            {
              type: "doc",
              label: "params",
              id: "runtime.setqueryparamsinboundpolicyoptions.params",
            },
          ],
        },
        {
          type: "doc",
          label: "SleepInboundPolicy",
          id: "runtime.sleepinboundpolicy",
        },
        {
          type: "category",
          label: "SleepInboundPolicyOptions",
          link: { type: "doc", id: "runtime.sleepinboundpolicyoptions" },
          items: [
            {
              type: "doc",
              label: "sleepInMs",
              id: "runtime.sleepinboundpolicyoptions.sleepinms",
            },
          ],
        },
        {
          type: "category",
          label: "TemporaryRedirectResponse",
          link: { type: "doc", id: "runtime.temporaryredirectresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.temporaryredirectresponse._constructor_",
            },
          ],
        },
        {
          type: "category",
          label: "UnauthorizedResponse",
          link: { type: "doc", id: "runtime.unauthorizedresponse" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.unauthorizedresponse._constructor_",
            },
          ],
        },
        {
          type: "doc",
          label: "urlRewriteHandler",
          id: "runtime.urlrewritehandler",
        },
        {
          type: "doc",
          label: "ValidateJsonSchemaInbound",
          id: "runtime.validatejsonschemainbound",
        },
        {
          type: "category",
          label: "ValidateJsonSchemaInboundOptions",
          link: { type: "doc", id: "runtime.validatejsonschemainboundoptions" },
          items: [
            {
              type: "doc",
              label: "validator",
              id: "runtime.validatejsonschemainboundoptions.validator",
            },
          ],
        },
        {
          type: "category",
          label: "ZuploApiError",
          link: { type: "doc", id: "runtime.zuploapierror" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.zuploapierror._constructor_",
            },
            {
              type: "doc",
              label: "status",
              id: "runtime.zuploapierror.status",
            },
            {
              type: "doc",
              label: "statusText",
              id: "runtime.zuploapierror.statustext",
            },
          ],
        },
        {
          type: "category",
          label: "ZuploContext",
          link: { type: "doc", id: "runtime.zuplocontext" },
          items: [
            { type: "doc", label: "log", id: "runtime.zuplocontext.log" },
            {
              type: "doc",
              label: "requestId",
              id: "runtime.zuplocontext.requestid",
            },
            { type: "doc", label: "route", id: "runtime.zuplocontext.route" },
            {
              type: "doc",
              label: "waitUntil",
              id: "runtime.zuplocontext.waituntil",
            },
          ],
        },
        {
          type: "category",
          label: "ZuploRequest",
          link: { type: "doc", id: "runtime.zuplorequest" },
          items: [
            {
              type: "doc",
              label: "(constructor)",
              id: "runtime.zuplorequest._constructor_",
            },
            { type: "doc", label: "params", id: "runtime.zuplorequest.params" },
            { type: "doc", label: "query", id: "runtime.zuplorequest.query" },
            { type: "doc", label: "user", id: "runtime.zuplorequest.user" },
          ],
        },
      ],
    },
  ],
};
module.exports = sidebars;
