import typographyPlugin from "@tailwindcss/typography";
import { Config } from "tailwindcss";

const typographyHeading = (overrides: any) => ({
  fontFamily: "ES Build",
  fontStyle: "normal",
  fontWeight: "bold",
  lineHeight: "120%",
  ...overrides,
});

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,md}"],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        // xs: ["0.75rem", { lineHeight: "1rem" }],
        // sm: ["0.875rem", { lineHeight: "1.5rem" }],
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
      borderRadius: {
        lg: "10px",
        xl: "14px",
      },
      colors: {
        pink: {
          DEFAULT: "#FF00BD",
          hover: "#CC0797",
        },
        red: {
          DEFAULT: "#F5CBD9",
        },
        gray: {
          DEFAULT: "#EDEDED",
          400: "#EDEDED",
          500: "#D9D9D9",
          600: "#808080",
        },
        purple: {
          400: "#CF50B3",
          600: "#1D1520",
        },
        info: {
          DEFAULT: "#0085FF",
          100: "#E5F3FF",
          300: "#B3DAFF",
        },
        warning: {
          DEFAULT: "#FDC420",
          100: "#FAF6E1",
          300: "#E7DFB6",
        },
        error: {
          DEFAULT: "#FD2067",
          100: "#FFF0F4",
          300: "#F6D5DD",
        },
        success: {
          DEFAULT: "#1CCC94",
          100: "#E9FBF8",
          300: "#B6E7DE",
        },
        discord: {
          DEFAULT: "#5865F2",
          hover: "#464ec7",
        },
        syntax: {
          DEFAULT: "#24292e",
          gray: "rgb(225, 228, 232)",
          dark: "rgb(106, 115, 125)",
          blue: "rgb(121, 184, 255)",
          border: "rgb(229, 231, 235)",
        },
      },
      lineHeight: {
        narrow: "1.2",
      },
      maxWidth: {
        "8xl": "88rem",
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
          },
        },
      }),
    },
    fontFamily: {
      sans: ["var(--font-be-vietnam-pro)", "sans-serif"],
      display: ["var(--font-be-vietnam-pro)", "sans-serif"],

      // Zuplo Fonts
      base: ["var(--font-be-vietnam-pro)", "sans-serif"],
      fancy: ["ES Build", "sans-serif"],
      mono: ["Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", "monospace"],
    },
    letterSpacing: {
      tightest: "-.075em",
      tighter: "-.05em",
      tight: "-.025em",
      normal: "0",
      wide: ".025em",
      wider: ".05em",
      widest: ".3em",
    },
  },
  plugins: [typographyPlugin],
} satisfies Config;
