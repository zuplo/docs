You can set the customerId globally (not recommended) by setting it at the
policy level or use the `customerIdPropertyPath` to read the customerId from the
user object on each request. For example, if you're using API Key auth or JWT
auth and want to use the `sub` property as the customerId, you would set the
value as follows

`"customerIdPropertyPath" : ".sub"`

You can also dive into the properties of the metadata. Imagine the
`request.user` property is as follows (either based on contents of a JWT token
or API Key metadata)

```json
{
  "sub": "bobby-tables",
  "data": {
    "email": "bob@example.com",
    "name": "Bobby Tables",
    "accountNumber": 1233423,
    "roles": ["admin"]
  }
}
```

You could access the `accountNumber` property as follows. Note the required
preceding `'.'`.

`"customerIdPropertyPath" : ".data.accountNumber"`

You can also set many of the properties of the meter payload programmatically,
either in a custom policy or handler. Here is some example code in a custom
inbound policy:

```ts
import {
  AmberfloMeteringPolicy,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  AmberfloMeteringPolicy.setRequestProperties(context, {
    customerId: request.user.sub,
    meterApiName: request.params.color,
  });

  return request;
}
```
