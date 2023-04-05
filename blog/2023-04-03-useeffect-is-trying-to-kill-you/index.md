---
title: useEffect is trying to kill you
authors: josh
tags: [react, rate-limiting, api, useEffect, performance, protection, security]
description: useEffect can make you your own worst enemy, protect yourself with rate-limiting
image: https://og-image.zuplo.com/?text=useEffect%20is%20trying%20to%20kill%20you
---

If you have used React in the last few years you can't have avoided the `useEffect` react hook. It's the Batman to your Robin, the Han Solo to your Chewbacca, of the React world.

If you're unfamiliar, the useEffect hook in React is used to handle side-effects in functional components. It allows developers to perform operations such as fetching data from APIs, subscribing to events, and setting up timers. The hook runs after every render or change to dependent property, and provides a way to manage stateful logic in a relatively declarative way.

And therein lies the terror - a dependent property. It's all too easy to create a loop in React, where your useEffect causes a chain of changes that updates the dependent property which triggers your useEffect call, which causes a chain of changes that updates the dependent property which triggers your useEffect call, which causes a chain of changes that updates teh dep... you get the idea.

Here's a simple example

```js
import React, { useState, useEffect } from "react";

function ExampleComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.log(error));
  }, [data]);

  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExampleComponent;
```

Note that the useEffect call declares a dependency on `data` but also updates that variable with `setData`. In most cases, these bugs are not so easy to spot and the loop is hidden by many different calls and a cascade of changes making it much harder to debug.

And notice, in this example we are invoking an API at `/api/data`. We just made a distributed DDoS machine. If you're lucky, this condition will _always_ happen like in the sample above and you'll notice it immediately. If, as happened to me recently, the loop only happens when the app is in a very specific state nested in a bunch of `if` statements, it might make it to production. At that point, it only takes a small percentage of your user base to experience this bug for you to bring down a full DDoS on your API.

The reality is that you rarely need rate-limiting to protect from your enemies. It's nearly always your partners or in-house development team that will accidentally take your backend down. Unfortunately the nature of React and useEffect makes this more likely.

The good news is it's easy to protect yourself. You can help prevent performance degradation, reduce costs, and improve the overall user experience of your application by implementing a rate-limiting on your API. You can use an open source package like [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) or use a SaaS service like Zuplo which is fully-managed, multi-cloud and distributed (over 200 data centers worldwide) - see [how to get started with rate-limiting using zuplo](https://zuplo.com/docs/articles/step-3-add-rate-limiting) - you can start for free.
