---
title: Developer Portal Theme
sidebar_label: Theming
---

The developer portal supports custom theming by editing the `docs/theme.css` file in your project. The following [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) and classes are supported. By default, we support a `light` and a `dark` theme, which can be toggled between by the user.

## Variables

| Variable                                      | Description                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| --background-code-sample-header-primary       | Background of header for API code sample unit                                   |
| --background-code-sample-header-secondary     | Highlight and dropdown color used in header for API code sample unit            |
| --background-example-section-header-primary   | Background of header for example body and responses unit                        |
| --background-example-section-header-secondary | Highlight and dropdown color used in header for example body and responses unit |
| --background-inline-code                      | Background used for inline `code` in markdown descriptions to aid readability   |
| --background-nav-item-selected                | Background of navigation label in the sidebar when navigated to                 |
| --background-primary                          | Primary background across all pages                                             |
| --color-divider                               | Color of divider between sections of the API docs                               |
| --color-nav-divider                           | Color of divider between sidebar and main page content                          |
| --font-family-primary                         | Primary font family used across all pages                                       |
| --text-color-code-sample-header               | Text color for API code sample unit                                             |
| --text-color-example-section-header           | Text color for example body and responses unit                                  |
| --text-color-h1                               | Text color for H1 tags (applies to page title and custom pages)                 |
| --text-color-h2                               | Text color for H2 tags (applies to docs section headers and custom pages)       |
| --text-color-h3                               | Text color for H3 tags (only used in custom pages)                              |
| --text-color-inline-code                      | Text color used for inline `code` in markdown descriptions to aid readability   |
| --text-color-nav                              | Text color used in the navigation sidebar                                       |
| --text-color-nav-hovered                      | Text color used on a hovered over sidebar label                                 |
| --text-color-nav-selected                     | Text color used on a selected over sidebar label                                |
| --text-color-primary                          | Primary text color used across all pages                                        |

## Theming

The theme color is set using the `.dark` or `.light` CSS class on the `body` like in the example below.

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

The logo of the portal is set via the CSS class `.theme-logo`.

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

Custom styles and CSS variables beyond what is documented above are not officially supported and may break with future releases. Use custom CSS with caution.

:::

The `theme.css` stylesheet is injected in the `<head>` of the dev portal. As such, you can modify any style you like. The portal is built using [Tailwind CSS](https://tailwindcss.com/).
