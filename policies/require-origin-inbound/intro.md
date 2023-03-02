The Require Origin policy is used to enforce that the client is sending an `origin` header that matches your allow-list specified in the policy options.

This is useful if you want to stop any browser traffic from different domains.

However, it is important to note that it does not guarantee that traffic is only coming from a browser. Somebody could simulate a browser request from a backend server and set any origin they like.

If the incoming origin is missing, or not allowed - a 400 Forbidden Problem Response will be sent to the client. You can customize the `detail` property in the policy options.
