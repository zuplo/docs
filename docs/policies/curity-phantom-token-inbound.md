---
title: Curity Phantom Token Auth Policy
sidebar_label: Curity Phantom Token Auth
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# Curity Phantom Token Auth






<!-- start: intro.md -->
Authenticate requests with Phantom Tokens issued by Curity. The payload of the Phantom JWT token, if successfully authenticated, with be on the `request.user.data` object accessible to the runtime.

<!-- end: intro.md -->

<PolicyStatus isBeta={false} isPaidAddOn={false} />



## Configuration 

The configuration shows how to configure the policy in the 'policies.json' document.

```json title="config/policies.json"
{
  "name": "my-curity-phantom-token-inbound-policy",
  "policyType": "curity-phantom-token-inbound",
  "handler": {
    "export": "CurityPhantomTokenInboundPolicy",
    "module": "$import(@zuplo/runtime)",
    "options": {
      "cacheDurationSeconds": 600
    }
  }
}
```

<div className="policy-options">
<div><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-configuration">Policy Configuration<a href="#policy-configuration" class="hash-link" aria-label="Direct link to Policy Configuration" title="Direct link to Policy Configuration">​</a></h3><ul><li><code>name</code> <span class="type-option">&lt;string&gt;</span> - The name of your policy instance. This is used as a reference in your routes.</li><li><code>policyType</code> <span class="type-option">&lt;string&gt;</span> - The identifier of the policy. This is used by the Zuplo UI. Value should be <code>curity-phantom-token-inbound</code>.</li><li><code>handler.export</code> <span class="type-option">&lt;string&gt;</span> - The name of the exported type. Value should be <code>CurityPhantomTokenInboundPolicy</code>.</li><li><code>handler.module</code> <span class="type-option">&lt;string&gt;</span> - The module containing the policy. Value should be <code>$import(@zuplo/runtime)</code>.</li><li><code>handler.options</code> <span class="type-option">&lt;object&gt;</span> - The options for this policy. <a href="#policy-options">See Policy Options</a> below.</li></ul><h3 class="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module" id="policy-options">Policy Options<a href="#policy-options" class="hash-link" aria-label="Direct link to Policy Options" title="Direct link to Policy Options">​</a></h3><p>The options for this policy are specified below. All properties are optional unless specifically marked as required.</p><ul><li><code>clientId</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The client ID of the Curity application.</p></div></li><li><code>clientSecret</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The client secret of the Curity application.</p></div></li><li><code>introspectionUrl</code><span class="type-option"> &lt;string&gt;</span><span class="required-option"> (Required)</span> - <div><p>The introspection URL of the Curity application.</p></div></li><li><code>cacheDurationSeconds</code><span class="type-option"> &lt;number&gt;</span> - <div><p>The duration in seconds to cache the introspected response.</p></div><span class="default-value"> Defaults to <code>600</code>.</span></li></ul></div>
</div>

## Using the Policy
<!-- start: doc.md -->
Adding the Curity Phantom Token Pattern to your route is trivial. Before getting
started, make sure that you have an instance of
[the Curity Identity Server](https://curity.io/) up and running.

### Setup the Curity Identity Server

Getting the Curity Identity Server up and running is quick. Follow the
[Getting Started Guide](https://curity.io/resources/getting-started/) to install
and configure the server.

#### Introspection

In addition to the instructions outlined in the Getting Started Guide a client
that enable introspection is needed. Typical recommendation for this is to
create a new separate client that only enables the introspection capability.

![](https://cdn.zuplo.com/assets/fed55feb-479f-40e6-82a3-734a7459fd97.png)

#### Exposing the Runtime

Depending on where the Curity Identity Server is deployed you might have to
expose the runtime node using a reverse proxy. One option is to use
[ngrok](https://curity.io/resources/learn/expose-local-curity-ngrok/) but other
solutions could also be used.

#### OAuth Tools

With the server up and running and available you can use
[OAuth Tools](https://oauth.tools/) to test the configuration and make sure that
you are able to obtain a token. If an opaque token is possible to obtain you are
good to continue.

### Set Environment Variables

Before adding the policy, there are a few environment variables that will need
to be set that will be used in the Curity Phantom Token Policy.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Environment
   Variables** section in the <SettingsTabIcon /> **Settings** tab.

2. Click **Add new Variable** and enter the name `INTROSPECTION_URL` in the name
   field. Set the value to URL endpoint of the Curity Identity Server that
   handles introspection. Ex.
   `https://idsvr.example.com/oauth/v2/oauth-introspect`

3. Click **Add new Variable** again and enter the name `CLIENT_ID` in the name
   field. Set the value to ID of the client that you added the introspection
   capability to.

4. Click **Add new Variable** again and enter the name `CLIENT_SECRET` in the
   name field. Set the value to the secret of the client that you added the
   introspection capability to. **Make sure to enable `is Secret?`.**

### Add the Curity Phantom Token Policy

The next step is to add the Curity Phantom Token Auth policy to a route in your
project.

The next step is to add the Curity Phantom Token Auth policy to a route in your
project.

1. In the [Zuplo Portal](https://portal.zuplo.com) open the **Route Designer**
   in the <CodeEditorTabIcon /> **Files** tab then click **routes.oas.json**.

2. Select or create a route that you want to authenticate with the Curity
   Phantom Token Pattern. Expand the **Policies** section and click **Add
   Policy**. Search for and select the **Curity Phantom Token Auth** policy.

<!-- ![img](../../static/media/curity-phantom-token-auth/curity-phantom-token-auth-policy.jpg) -->

3. Add the following to options:

```json
    "clientId": "$env(CLIENT_ID)",
    "clientSecret": "$env(CLIENT_SECRET)",
    "introspectionUrl": "$env(INTROSPECTION_URL)",
```

The policy configuration should now look like this:

<!-- ![img](../../static/media/curity-phantom-token-auth/curity-phantom-token-policy-config.jpg) -->

4. Click **OK** to save the policy.

5. Click **Save All** to save all the configurations.

### Test the Policy

Head over to [OAuth Tools](https://oauth.tools/) to test the policy.

1. Run a flow to obtain an opaque token (typically Code Flow)

2. Configure an **External API** flow and add your Zuplo endpoint in the **API
   Endpoint** field. Set the request method and choose the opaque token obtained
   in step 1.

![](https://cdn.zuplo.com/assets/a7752689-f57d-45e5-8103-87116d3ab779.png)

3. Click **Send**. The panel on the right should now display the response from
   the API. If the upstream API echoes back what is sent you will see that the
   `Authorization` header now contains a JWT instead of the original opaque
   token that was sent in the request.

### Conclusion

You have now setup the Curity Phantom Token Pattern for Authentication. Your API
Gateway now accepts an opaque access token in the Authorization header and will
handle obtaining a corresponding signed JWT that will be passed on to the
upstream API.

<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
