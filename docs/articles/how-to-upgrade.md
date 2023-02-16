---
title: How to upgrade
---

Path matching in Zuplo uses the popular npmjs package [path-to-regexp](https://github.com/pillarjs/path-to-regexp) - you can learn even more about it on their [repo](https://github.com/pillarjs/path-to-regexp).

The most basic path is `/` which will simple match the root path. You can add other static paths like `/foo` and `/foo/bar`

## Dynamic Paths

Path-to-regex supports dynamic matching including a feature that will parameterize parts of the URL. For example:

Path: `/products/:productId/sizes/:size` will match the following paths

`/products/pizza/size/small` and set the params object on `request` to:

```json
{
  "productId": "pizza",
  "size": "small"
}
```

:::tip

Query-strings (or search parameters) will not affect path matching.

:::

## Regular Expressions and Wildcards

You can also use regular expressions in your paths. They must be contained in `()` to indicate to `path-to-regexp` that they are regex.

**Examples**

Path `/(.*)` will match anything.

:::note

This is a true wildcard route and can be used for custom 404s by making this the last route in your routes.json (and matching all methods).

:::

Path `/(a?b)` will match either `/ab` or `/b`.

Path `/main/(a|b)` will match `/main/a` or `/main/b`.

Path `/icon-(\d++).png` will match `/icon-1234.png` or any other series of digits for 1234.

## Named groups

You can also name your regexp groups so that they appear as named parameters.

Path `products/:productId/icons/icon-:imageIndex(\d+).png` will match `/products/pizza/icons/icon-2.png` and produce a `request.params` object as follows:

```json
{
  "productId": "pizza",
  "imageIndex": "2"
}
```

## Not supported

Note that not all regex features are available, us of the following will either be ignored or result in an error, including

- `(?:...)` - named matches
- `^` or `$` - start or end of string
- `[abc]` - character classes

## Route tester

There is a simple [route tester](http://forbeslindesay.github.io/express-route-tester/) available that can be used to debug route matching with `path-to-regexp`.
