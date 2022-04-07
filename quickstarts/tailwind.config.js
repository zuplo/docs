const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;
const typographyHeading = (overrides) => ({
  fontFamily: "ES Build",
  fontStyle: "normal",
  fontWeight: "bold",
  lineHeight: "120%",
  ...overrides,
});

const plainText = {
  // TODO: Replace with theme => theme("colors.black"),
  //  couldn't make it work
  color: "#000",
  fontSize: "16px",
  lineHeight: "24px",
};

module.exports = {
  mode: "jit",
  safelist: [
    "border-success-300",
    "bg-success-100",
    "border-info-300",
    "bg-info-100",
    "border-warning-300",
    "bg-warning-100",
    "border-error-300",
    "bg-error-100",
  ],
  content: ["./dist/**/*.html"],
  theme: {
    screens: {
      sm: "576px",
      md: "760px",
      lg: "992px",
      xl: "1220px",
    },
    extend: {
      colors: {
        pink: {
          DEFAULT: "#FF00BD",
          hover: "#CC0797",
        },
        red: "#F5CBD9",
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
        discord: "#5865F2",
        "discord-hover": "#464ec7",
      },
      borderRadius: {
        lg: "10px",
        xl: "14px",
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: (theme) => theme("colors.pink.DEFAULT"),
              "&:hover": {
                color: (theme) => theme("colors.pink.hover"),
                fontWeight: 300,
              },
              fontWeight: 300,
            },
            h1: typographyHeading({ fontSize: "28px" }),
            h2: typographyHeading({ fontSize: "24px" }),
            h3: typographyHeading({ fontSize: "20px" }),
            p: plainText,
            li: {
              ...plainText,
              marginTop: 6,
              marginBottom: 6,
              "&::marker": {
                color: "#000",
              },
            },
            blockquote: {
              fontWeight: "300",
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },
            "code::before": {
              content: null,
            },
            "code::after": {
              content: null,
            },
          },
        },
        xl: {
          css: {
            img: {
              marginTop: em(24, 14),
              marginBottom: em(24, 14),
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: em(24, 14),
              paddingRight: em(24, 14),
            },
          },
        },
        sm: {
          css: {
            img: {
              marginTop: em(24, 14),
              marginBottom: em(24, 14),
              marginLeft: "auto",
              marginRight: "auto",
            },
          },
        },
      },
    },
    fontFamily: {
      base: ["Be Vietnam Pro", "sans-serif"],
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
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
