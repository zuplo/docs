---
title: Developer Portal Theme
sidebar_label: Theme
---

The developer portal supports custom theming by editing the `docs/theme.css` file in your project. The following [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) and classes are supported.

## Variables

```txt
--background-inline-code
--background-nav
--background-nav-item-selected
--background-primary
--color-divider
--color-nav-divider
--font-family-primary
--text-color-h1
--text-color-h2
--text-color-h3
--text-color-inline-code
--text-color-nav
--text-color-nav-hovered
--text-color-nav-selected
--text-color-primary
```

## Theming

The theme color is set using the `.dark` or `.light` css class on the `body` like the example below.

```html
<body class="light">
  ...
</body>
```

You can use this class to set custom values for each variable.

```css
.dark {
  --background-primary: black;
}

.light {
  --background-primary: white;
}
```

The logo of the portal is set via the css class `.theme-logo`.

```css
.dark {
  --var-theme-logo-url: url(https://example.com/logo-dark.svg);
}

.light {
  --var-theme-logo-url: url(https://example.com/logo-light.svg);
}

.theme-logo {
  content: var(--var-theme-logo-url);
}
```

## Additional Modifications

:::danger

Custom styles and css variables beyond what are documented above are not officially supported and may break with future releases. Use custom CSS with caution.

:::

The `theme.css` stylesheet is injected in the `<head>` of the dev portal. As such, you can modify any style you like. The portal is built using [Tailwind CSS](https://tailwindcss.com/).
