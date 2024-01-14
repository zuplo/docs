import typographyPlugin from "@tailwindcss/typography";
import { type Config } from "tailwindcss";

const typographyHeading = (overrides: any) => ({
  fontFamily: ["var(--font-inter)", "sans-serif"],
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "120%",
  ...overrides,
});

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,md}"],
  darkMode: "class",
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "2rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
      "3xl": ["2rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      fontFamily: {
        sans: "var(--font-inter)",
        display: ["var(--font-inter)", { fontFeatureSettings: '"ss01"' }],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      borderRadius: {
        sm: "8px",
        lg: "10px",
        xl: "14px",
      },
      colors: {
        pink: {
          DEFAULT: "#FF00BD",
          hover: "#CC0797",
        },
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.pink.DEFAULT"),
              "&:hover": {
                color: theme("colors.pink.hover"),
                fontWeight: "inherit",
              },
              fontWeight: "inherit",
            },
            h1: typographyHeading({ fontSize: "30px" }),
            h2: typographyHeading({ fontSize: "26px" }),
            h3: typographyHeading({ fontSize: "20px" }),
            h4: typographyHeading({ fontSize: "18px" }),
            h5: typographyHeading({ fontSize: "16px" }),
            li: {
              "&::marker": {
                color: "black",
              },
            },
            "code::before": {
              content: null,
            },
            "code::after": {
              content: null,
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
            // '.prose :where(code):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))':
            //   {
            //     fontWeight: 500,
            //     borderWidth: 1,
            //     borderColor: theme("colors.gray.300"),
            //     backgroundColor: theme("colors.gray.50"),
            //     borderRadius: 4,
            //     padding: 4,
            //   },
          },
        },
        lg: {
          css: {
            h1: typographyHeading({ fontSize: "46px" }),
            h2: typographyHeading({ fontSize: "30px" }),
            h3: typographyHeading({ fontSize: "22px" }),
            h4: typographyHeading({ fontSize: "18px" }),
            h5: typographyHeading({ fontSize: "16px" }),
          },
        },
        invert: {
          css: {
            // "--tw-prose-headings": theme("colors.white"),
            // "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-body": theme("colors.white"),
            p: {
              color: "white",
            },
            ul: {
              color: "white",
            },
          },
        },
      }),
    },
  },
  plugins: [typographyPlugin],
} satisfies Config;
