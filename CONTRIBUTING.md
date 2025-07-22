# Contributing

General notes on editing docs and blog posts.

## Error Pages

Every error message in Zuplo's runtime has a `help_url` that points to
`https://zup.fail/ERROR_MESSAGE`. These URLs redirect to the docs site to a URL
in the format `https://zuplo.com/docs/errors/error-message/`. When adding a new
error message create a page in `./docs/errors` to document the error.

## Image Components

The docs provide several custom components for displaying images with specific
styling:

### Framed

The `Framed` component adds horizontal margins to images, useful for centering
content or creating visual breathing room.

```mdx
<Framed>

![Alt text](path/to/image.png)

</Framed>
```

With margin sizes:

```mdx
<Framed size="sm">

![Alt text](path/to/image.png)

</Framed>
```

Available margin options:

- `sm` - Small image with large margins (mx-32)
- `md` - Medium image with medium margins (mx-16)
- `lg` - Large image with small margins (mx-8)
- No margin prop - Auto-centered

### ModalScreenshot

The `ModalScreenshot` component wraps images to make them appear like modal
dialogs, perfect for UI screenshots that show modal windows.

```mdx
<ModalScreenshot>

![Alt text](path/to/image.png)

</ModalScreenshot>
```

With margin sizes:

```mdx
<ModalScreenshot size="md">

![Alt text](path/to/image.png)

</ModalScreenshot>
```

Features:

- Semi-transparent background overlay (30% opacity)
- Backdrop blur effect
- Modal-style shadow and border
- Rounded corners
- Same margin options as `Framed` (sm, md, lg)

### Screenshot

The `Screenshot` component renders a plain image without any additional styling
(no borders or shadows).

```mdx
<Screenshot src="path/to/image.png" alt="Alt text" />
```
