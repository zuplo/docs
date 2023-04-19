---
title: Bringing Types to APIs with TypeSpec
authors: nate
tags: [openapi, api, typespec]
description: An easier way to design APIs with Microsoft's new language TypeSpec
image: https://og-image.zuplo.com/?text=Bringing%20Types%20to%20APIs%20with%20TypeSpec
---

Good API design is intentional. You are building something that needs to be easy to use, maintainable, scalable, and robust.

This is the problem that OpenAPI helps solve. Instead of hacking an API together, OpenAPI lets you design within a specification and generate code from there. While OpenAPI definitely improves API design, documentation, and collaboration, it has a couple of challenges:

- It has a **steep learning curve**. For developers new to OpenAPI, there can be a learning curve to understand the specification's syntax, structure, and best practices. This may require an initial investment of time and effort.
- It’s **verbose**. OpenAPI specifications can become quite large and verbose, especially for complex APIs. This can make it difficult to manage, maintain, and understand the API design.

These issues lead to more errors in the specifications, which lead to more errors in the eventual endpoints. They also make OpenAPI specs difficult to grok for new developers, and difficult to reuse for even senior developers. Again, both of these issues lead to more errors.

Making API design easier, both in terms of learning and writing is the motivation behind [Microsoft’s TypeSpec](https://microsoft.github.io/typespec/). TypeSpec is _"a language for describing cloud service APIs and generating other API description languages, client and service code, documentation, and other assets."_

Basically, it is TypeScript for APIs. Like TypeScript, TypeSpec allows you to explicitly define types for variables, function parameters, and return values, which helps catch type-related errors during compile time (you can compile your TypeSpec to OpenAPI, or REST, or gRPC, or graphQL). It also lets you take advantage of Improved tooling and editor support for better code intelligence, better code organization with interfaces, namespaces, and modules, and better error handling with defined error messages. It brings a more dev-focused approach to API design.

Let’s take a look at how TypeSpec works and some of the main challenges in API design it addresses.

## The challenges with designing APIs

The fact that TypeSpec comes from Microsoft is not a coincidence. Across Azure, the teams are dealing with hundreds of endpoints for internal and external use, for dozens of services. They are constantly designing new APIs. Having a system that can be configurable and understandable across the organization is critical.

The usual way to deal with this is through guidelines and best practices. As the scale and complexity of APIs grow, it becomes increasingly important to establish and enforce guidelines and best practices for API design. This can include aspects such as naming conventions, error handling, versioning, and security.

But these are just guidelines. Ensuring that developers across different teams adhere to these guidelines is a huge challenge. Specs such as OpenAPI help with this, but they don’t encourage or enforce:

- **Reuse**: As the number of API endpoints and resources increases, it can be challenging to identify and reuse common patterns, data structures, and functionalities. Ensuring that APIs follow consistent patterns and avoid duplicating functionality is crucial for maintainability, ease of use, and performance.
- **Modularity**: APIs at scale should be designed to be modular, allowing components to be developed, tested, and maintained independently. This helps to avoid tight coupling between components and facilitates a more manageable codebase. Striking the right balance between modularity and simplicity can be challenging.
- **Consistency**: Ensuring consistency across a large set of APIs is essential for usability and maintainability. This includes consistent naming conventions, data formats, and behaviors. As the number of API endpoints and developers working on them increases, maintaining consistency can become more difficult.

OpenAPI also doesn’t support multiple protocols. Designing APIs at scale may require support for multiple protocols, such as REST, GraphQL, gRPC, or WebSocket. There isn’t a paradigm for accommodating these different protocols while maintaining a consistent design and user experience can be challenging.

TypeSpec is a protocol-agnostic language for building API descriptions at scale. It applies learnings from programming languages to API design. It has:

- A **familiar syntax**, being based on TypeScript
- **Tooling** for intellisence and code completion
- **Templating** for reuse
- **Extensibility** to support any protocol.

Let’s work through an example to show some of these at work.

## Using TypeSpec

Let’s build an OpenAPI specification via the TypeSpec language. We’ll build a toy API, emit an OpenAPI specification, and then show how you can start to modularize your API design for better consistency and easier reuse.

As TypeSpec is based on TypeScript, the install and initialization will look familiar to anyone that knows JS. First, we’ll use NPM to install our compiler:

```bash
npm install -g @typespec/compiler
```

Being a Microsoft product, you can also get nice extensions for Code and VScode:

```bash
tsp code install
tsp vs install
```

Once the compiler is installed, we want to initialize the first project:

```bash
tsp init
```

This will prompt you with a few questions. As you build your own projects, you should choose the setup that fits your needs. Here, we’re going to pick the Generic Rest API template, a project name, and the @typespec/openapi3 library.

Then you can install the dependencies:

```bash
tsp install
```

This will install some node packages (this is node and npm under the skin) and create three new files:

- **package.json**. A package manifest defining your typespec project as a node package.
- **tspconfig.yaml**. Your TypeSpec project configuration file to configure emitters, emitter options, compiler options, etc.
- **main.tsp**. The TypeSpec entrypoint

With that done you can start creating your TypeSpec. If we look at main.tsp now we’ll see just the top import:

```ts
import "@typespec/rest";
import "@typespec/openapi3";
```

We’ll use the HTTP service example from the [CADL playground](https://cadlplayground.z22.web.core.windows.net/) to work through (CADL was the internal project name for this at Microsoft. If you are looking for more information on TypeSpec, be sure to search for CADL as well).

After the imports, the first line sets up the generic namespace we are using (`TypeSpec.Http`).

Then we use the `@service` decorator to specify the service definition. We use this to set the title of the service and the version. We then set the namespace for our specific service. Namespaces will let us group related types together for better organization and to prevent name conflicts:

```ts
//...

using TypeSpec.Http;
@service({
  title: "Widget Service",
  version: "1.0.0",
})
namespace DemoService;
```

When we’re setting up our namespace, we can add a couple of other decorators:

- **@server** - the endpoint for the service
- **@doc** - a human-readable definition of the service

With that done, we can define our first model. We do that with the model keyword followed by the name we want for that model.

We are now at the Types part of TypeSpec. In each model we can set the type expected for each parameter for that model:

- id is expecting a string
- Weight in expecting and integer
- Color is expecting a string with two possible values, red or blue.

There is also a @path decorator before the id, meaning that this property is a path parameter:

```ts
//...

model Widget {
  @path id: string;
  weight: int32;
  color: "red" | "blue";
}
```

When we’ve defined our models we can define our interface.

First we’ll define our `@route` for this particular endpoint. Then a `@tag` that we can use with OpenAPI or Swagger to group our paths.

Finally, we’ll define an interface object containing all our operations. Each operation is defined using a decorator, then has the parameters and the return type. So, for instance:

```
@get list(): Widget[] | Error;
```

Here, we’ll set this up for a regular REST operations:

```ts
// ...

@route("/widgets")
@tag("Widgets")
interface Widgets {
  @get list(): Widget[] | Error;
  @get read(@path id: string): Widget | Error;
  @post create(...Widget): Widget | Error;
  @patch update(...Widget): Widget | Error;
  @delete delete(@path id: string): void | Error;
}
```

Finally, we want to define that Error that might be returned. This is a simple error, but you should use [Problem Details](https://zuplo.com/blog/2023/04/11/the-power-of-problem-details).

```ts
// ...

@error
model Error {
  code: int32;
  message: string;
}
```

With the service, model, interface, and error defined we can compile into an OpenAPI specification:

```bash
tsp compile .
```

This will produce a new directory, tsp-output, and ‘emit’ an openapi.yaml file defining your API.

```yaml
openapi: 3.0.0
info:
  title: Widget Service
  version: 1.0.0
tags:
  - name: Widgets
paths:
  /widgets:
    get:
      tags:
        - Widgets
      operationId: Widgets_list
      parameters: []
      responses:
        "200":
          description: The request has succeeded.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Widget"
                x-typespec-name: Widget[]
        default:
          description: An unexpected error response.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Error"
    post:
      tags:
        - Widgets
```

Going through the entire spec, we can see how some of the elements in the TypeSpec have compiled to OpenAPI. Here’s our Widget model, with the properties and requirements:

```yaml
Widget:
  type: object
  properties:
    id:
      type: string
    weight:
      type: integer
      format: int32
    color:
      type: string
      enum:
        - red
        - blue
      x-typespec-name: red | blue
  required:
    - id
    - weight
    - color
```

Here’s is our error model:

```yaml
Error:
  type: object
  properties:
    code:
      type: integer
      format: int32
    message:
      type: string
  required:
    - code
    - message
```

What if we want to add another endpoint? We can do the obvious thing, which would be to copy the Widgets model and interface and just change the names. But TypeSpec gives us another options for this–Templates

We’ll create a new file called library.tsp and add our interface and error into this file:

```ts
import "@typespec/http";

using TypeSpec.Http;

@error
model Error {
 code: int32;
 message: string;
}

interface ResourceInterface<T> {
  @get list(): T[] | Error;
  @get read(@path id: string): T | Error;
  @post create(...T): T | Error;
  @patch update(...T): T | Error;
  @delete delete(@path id: string): void | Error;
}
```

We create a generic ResourceInterface that takes in TypeScript parameters (T). We can then use these in our main.tsp. We can import our library and then use our template ResourceInterface to create our model-specific interfaces:

```ts
import "@typespec/http";
import "./library.tsp";

using TypeSpec.Http;
@service({
 title: "Widget Service",
 version: "1.0.0",
})
namespace DemoService;

model Widget {
 @path
 id: string;
 weight: int32;
 color: "red" | "blue";
}

model Gadget {
 @path id: string;
 height: float32;
 width: float32;
 color: "green" | "yellow";
}

@route("/widgets")
@tag("Widgets")
interface Widgets extends ResourceInterface<Widget> {
}

@route("/gadgets")
@tag("Gadgets")
interface Gadgets extends ResourceInterface<Gadget> {
}
```

These ~30 lines can then be compiled to produce a 250-line OpenAPI specification.

## More robustness from less work

From even the toy example above, you can start to see the possibilities with TypeSpec, especially if you are working on APIs at scale or trying to define standards across teams. Leaders in an organization can literally set the interfaces, errors, conventions, and models in a repo for thousands of team members.

For example, If you have a specific way you want errors to be returned, it’s a few lines and then available to everybody, enforced through the compilation step. If someone tries to add their own Error model in main.tsp when they are also importing one from a library, they’ll get an error at compile time.

Here, we’ve only described a REST API and an OpenAPI specification. But emitters can be produced for any protocol, and you can extend TypeSpec exactly the way needed for your team. You can tailor it for your environment. We are doing exactly this at Zuplo.

You can check out more about [TypeSpec on GitHub](https://microsoft.github.io/typespec/) and play around with the language on the [playground](https://cadlplayground.z22.web.core.windows.net/). Microsoft has written more about it [here](https://devblogs.microsoft.com/azure-sdk/the-value-of-cadl-in-designing-apis/) and [here](https://devblogs.microsoft.com/azure-sdk/describing-a-real-api-with-cadl-the-moostodon-story/).
