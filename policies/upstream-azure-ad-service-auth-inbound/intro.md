This policy adds a `Authorization` header to the upstream request that allows using Azure AD to authenticate requests to your origin server. This is a useful means of securing your origin server so that only your Zuplo gateway can make requests against it.

Using this policy allows you to delegate authentication and authorization to your gateway without writing any code on your origin service. For instructions on how to configure Azure AD authentication see [Azure's documentation](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad).
