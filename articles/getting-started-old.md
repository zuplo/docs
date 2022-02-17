# Getting Started

We've designed Zuplo to be easy to get started, our goal is you go from zero to
live API gateway in under 2 minutes.
[Let us know if we fail on this and why](https://discord.gg/CEZrnZN897)!

## Sign in

1. Sign in - you should sign in at
   [https://portal.zuplo.com](https://portal.zuplo.com) using the e-mail address
   you asked to be associated with your alpha trial of zuplo.

## Create your first API

1. On your first login, you will automatically be taken to the create screen

![Untitled](/media/getting-started-old/Untitled.png)

1. Enter the name of your project. All project names must be in kebab-case.
2. Click 'Create Project' and you'll be taken to the project view -
   [guided tour of the portal](The%20Portal%20fcdc9.md).

![Untitled](/media/getting-started-old/Untitled%201.png)

> Note, we will also support development directly in VSCode, Sublime Text or
> whatever tools you like to use to code TypeScript. For the Alpha our initial
> focus is on the portal so we ask you to use this experience for now.

## Test your API

1. W scaffold an example project for you that is ready to go, try it out! To
   test your new API you can use our integrated test console (as shown in the
   gif below):

![2021-11-15 15.06.39.gif](/media/getting-started-old/2021-11-15_15.06.39.gif)

1. Navigate to the API Test Console (the lightning icon on the left) and choose
   the `hello-world.json` test.
2. Click the `Test` button and invoke your API. You can see the status, headers
   and body from your new API.
3. You can easily change the response of your simple API by navigating to the
   files section (top icon on the left) and opening the module `hello-world.ts`.
   Edit the file to return anything you like (save by clicking `Save` or hitting
   `⌘S`). You can read more about request handlers
   [here](https://www.notion.so/Request-Handlers-d94c4e9db5be4351afb61f1755ab6f9c).

## Routes & Route Testing

1. Routing is a key part of Zuplo - open routes.json to understand why
   `/v1/hello-world` invokes the function in `modules/hello-world.ts`.

![Untitled](/media/getting-started-old/Untitled%202.png)

1. You'll see the default route called `What zup?` in the Route Designer. Note
   how it maps to a `default` export on the `hello-world` module as shown in the
   `Function` field.

This means that any request that is either a `GET` or `POST` (per the `Method`
field) and is on the `/v1/hello-world` URL will invoke that request handler.

> Note - during alpha the `...` button next to the `Function` field is inactive.
> To configure a module and export for the handler you'll need to switch to the
> json view by clicking on the `routes.json` tab. It's hopefully
> self-explanatory.

1. Let's add a new route with some parameters
   - Method: GET
   - Path: `/products/:productId/cats/:catId`
   - Version: `none`
   - Label: `My first custom route`
   - CORS: `Anything Goes`
   - Function: Click the picker `...` - you'll get an alert saying this is
     coming soon. For now you'll have to edit the routes.json file directly.
2. Note that we used the parameters`:productId` and `:catId` in our path. These
   are tokens that will match other strings. Let's test it out using the route
   tester (also shown in the gif below).

   ![2021-11-15 15.27.35.gif](/media/getting-started-old/2021-11-15_15.27.35.gif)

3. Open the `Route Tester` in the top right of the route designer.
4. Test the default route by clicking `Test Route` - it should highlight the
   original route.
5. Now change the test path to `/products/123/cats/cheshire` or similar and
   click `Test Route`` .
6. It should highlight your new route - you're now confident this route will
   work. Note how it highlights the values of the parameters `productId` and
   `catId`. These would be available in the request handler on the `params`
   property of the `request` parameter.

## Your first route handler

1. Now let's add a new handler. On the `Modules` folder click the `+` icon and
   enter a filename like `my-first-route` (we'll add `.ts` for you)

![2021-11-15 15.44.11.gif](/media/getting-started-old/2021-11-15_15.44.11.gif)

1. Let's customize the new module to echo the params and body back to the
   client, here's some sample code:

```tsx
import { ZuploRequest, ZuploContext } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // to read the body we can use request.text()
  // it's asynchronous so we need to await it.
  // if we were confident the body was JSON
  // we could use request.json() to parse the json
  // into an object, but in this case we don't know
  // so we'll just use text
  const bodyText = await request.text();

  return {
    productId: request.params.productId,
    catId: request.params.catId,
    bodyText,
  };
}
```

1. Edit the routes.json file to point your new route to your new handler:

```json
//...

{
  "path": "products/:productId/cats/:catId",
  "corsPolicy": "AnythingGoes",
  "label": "My first route",
  "methods": ["POST"],
  // Change the `handler` to point your new module as shown below
  // (the module file without the .ts extension)
  "handler": {
    "module": "$import(./modules/my-first-route)",
    "export": "default"
  },
  "version": "none"
}

//...
```

1. Test your new handler by adding a new API test file. Choose the API test
   console and click the `+` icon.
2. Change the `method` of your new test to `POST`enter a body and update the
   path, then hit `Test` - see the gif below.

![2021-12-02 20.39.21.gif](/media/getting-started-old/2021-12-02_20.39.21.gif)

1. Try sending JSON in the POST body and then changing the code to use
   `await request.json()` and notice how the response changes to show the object
   was parsed.

# Congratulations - y**ou are now a competent Zuplo Developer! Achievement Unlocked 🎉**

Next:
[Proxy a simple request](How%20To%20&%20S%20595e6/Proxy%20a%20si%20ee52a.md)
