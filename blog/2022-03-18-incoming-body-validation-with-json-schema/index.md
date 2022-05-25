---
title: Incoming body validation with JSON Schema
authors: josh
tags: [videos, code]
---

<YouTubeVideo url="https://www.youtube-nocookie.com/embed/BY8DQyhN_0c" />

Length: 2 minutes

Bad inputs can easily break your API. Stop bad form before it even hits your API with Zuplo. In this demo we show how you can add JSON validation to an API without touching your original API.

We use JSON Schema with our JSON Validation policy. Here's the schema:

```json
{
  "title": "Person",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The person's first name.",
      "pattern": "\\S+ \\S+"
    },
    "company": {
      "type": "string"
    }
  },

  "additionalProperties": false,
  "required": ["name"]
}
```

Easy peasy.
