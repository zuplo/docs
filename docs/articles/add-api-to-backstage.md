---
title: Add API to Backstage
---

In this guide, we'll walk you through the steps to add a your Zuplo API to
[Backstage](https://backstage.io/).

Support for Backstage is currently limited to manual synchronization. If you
require additional support for Backstage, please
[let us know](mailto:support@zuplo.com?subject=Improved%20Support%20for%20Backstage&body=I%20would%20like%20to%20see%20improved%20support%20for%20backstage.io%20%5BINSERT%20DETAILS%20HERE%5D)

## 1/ Add the OpenAPI Spec Handler

Backstage allows you to document
[API entities](https://backstage.io/docs/features/software-catalog/descriptor-format/#kind-api)
using an OpenAPI file. Although Zuplo is OpenAPI based, you cannot directly use
your `routes.oas.json` file, as it is missing details about your API. Instead,
you will need to use the public-ready version of your spec, by adding an
[OpenAPI Spec Handler](https://zuplo.com/docs/handlers/openapi).

Add a new route with the path `/openapi`, and select the `OpenAPI Spec Handler`
from the Request Handler selector. Save your changes and commit them to your
production branch. You should now get back your public-ready OpenAPI file by
hitting `https://<your-prod-zuplo-api-domain>/openapi`.

![alt text](../../public/media/add-api-to-backstage/image-3.png)

## 2/ Add the catalog-info.yaml file

In your API's repository, add a new file `catalog-info.yaml` to the root.
Prefill it with the following

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: # Your API name
  annotations:
    github.com/project-slug: # Your github project slug Ex. org/repo-name
spec:
  type: openapi
  lifecycle: experimental # Change to match your project
  owner: guests # Change to match your project
  system: examples # Change to match your project
  definition: | # Continue reading to learn how this gets generated
```

Unfortunately, Backstage only supports yaml for an API `definition`. You can
grab your public-ready OpenAPI spec from step 1, and then run it through a JSON
to YAML converter like [this one](https://www.json2yaml.com/). Add the converted
OpenAPI to the definition section.

```yaml
definition: |
  openapi: 3.1.0
    info:
      description: 'This is a sample server Petstore server.  You can find out more about
        Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For
        this sample, you can use the api key `special-key` to test the authorization filters.'
      version: 1.0.0
    ...
```

Commit this file to your production branch.

## 3/ Add your API Component to Backstage

Using the
[API Documentation](https://github.com/backstage/backstage/blob/master/plugins/api-docs/README.md)
plugin, you can register APIs in your Backstage portal. Navigate to the APIs
tab, and click 'REGISTER EXISTING API'.

![alt text](../../public/media/add-api-to-backstage/image-5.png)

When prompted for the component URL, enter the github URL of your
`catalog-info.yaml` file (ex.
https://github.com/AdrianMachado/adrian-api/blob/main/catalog-info.yaml).

![alt text](../../public/media/add-api-to-backstage/image-4.png)

Complete registration of your API.

## 4/ Link the API to a component

Your API is now tracked in Backstage. If you are using the Backstage getting
started template, go to your `entities.yaml` file and add your API to the
`example-website` component.

```yaml
apiVersion: backstage.io/v1alpha1
kind: System
metadata:
  name: examples
spec:
  owner: guests
---
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-website
spec:
  type: website
  lifecycle: experimental
  owner: guests
  system: examples
  providesApis: [<YOUR_API_NAME>] # This must match the metadata.name from step 2
```

You should now be able to see your API under the APIs tab in Backstage. If you
navigate to your API and click the 'DEFINITION' tab - you can even preview your
OpenAPI spec.

![alt text](../../public/media/add-api-to-backstage/image-6.png)

Congratulations! You've successfully added your Zuplo API to Backstage. You can
repeat the steps above for all of your OpenAPI files.

## Troubleshooting

### I can't connect to Github

If your repository is not public and you haven't already configured Github
authentication - follow the guide
[here](https://backstage.io/docs/getting-started/config/authentication). For
sign in support, you will likely want to add sign-in support as well as a part
of your Backstage setup.

```yaml
auth:
  allowGuestAccess: true
  environment: development
  providers:
    github:
      development:
        clientId: <YOUR_CLIENT_ID>
        clientSecret: <YOUR_CLIENT_SECRET
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
            - resolver: usernameMatchingUserEntityName
```

### How can I keep my OpenAPI file in sync?

Base Backstage doesn't support continuous syncing with an OpenAPI file. Hosted
platforms like
[Roadie.io](https://roadie.io/docs/getting-started/openapi-specs/) seem to have
support for this. We do not guarantee support for these platforms.
