const plugin = require("tailwindcss/plugin");

const mirrorHexColors = (colors) =>
  Object.fromEntries(
    colors.map((color, index) => {
      if (!/#[a-f0-9]{6}/.test(color)) {
        throw new Error(
          'All colors should be lowercase hexadecimal strings 7 characters long with "#" sign at the beginning',
        );
      }

      if (colors.indexOf(color) !== index) {
        throw new Error("Colors should be unique");
      }

      if (colors[index - 1] > color) {
        throw new Error("Colors should be sorted alphabetically");
      }

      return [color.substring(1), color];
    }),
  );

const commonGridTemplate = {
  "fr/auto": "1fr auto",
  "auto/fr": "auto 1fr",
  "auto/fr/auto": "auto 1fr auto",
  "auto/auto/fr": "auto auto 1fr",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        ...mirrorHexColors([
          "#000000",
          "#060816",
          "#0d1020",
          "#0f1328",
          "#183c4a",
          "#191c20",
          "#28282d",
          "#4940e0",
          "#938cfa",
          "#96a0db",
          "#a39dff",
          "#bcc5f9",
          "#f9f9f9",
          "#ff6848",
          "#ffffff",
        ]),
      },

      gridTemplateColumns: {
        container: "1fr minmax(0, calc(328 * .25rem)) 1fr",
        "container-wide": "1fr minmax(0, calc(353 * .25rem)) 1fr",
        ...commonGridTemplate,
      },

      gridTemplateRows: {
        ...commonGridTemplate,
      },

      fontFamily: {
        sora: ["Sora", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        inter: ["inter", "sans-serif"],
      },

      fontSize: {
        72: ["calc(72 * 1rem / 16)", { lineHeight: "calc(86 * 1rem / 16)" }],
        64: ["calc(64 * 1rem / 16)", { lineHeight: "calc(76.8 * 1rem / 16)" }],
        48: ["calc(48 * 1rem / 16)", { lineHeight: "calc(57.6 * 1rem / 16)" }],
        40: ["calc(40 * 1rem / 16)", { lineHeight: "calc(48 * 1rem / 16)" }],
        24: ["calc(24 * 1rem / 16)", { lineHeight: "calc(28.8 * 1rem / 16)" }],
        20: ["calc(20 * 1rem / 16)", { lineHeight: "calc(23.7 * 1rem / 16)" }],
        18: ["calc(18 * 1rem / 16)", { lineHeight: "calc(21.6 * 1rem / 16)" }],
        16: ["calc(16 * 1rem / 16)", { lineHeight: "calc(19.2 * 1rem / 16)" }],
        14: ["calc(14 * 1rem / 16)", { lineHeight: "calc(18 * 1rem / 16)" }],
        13: ["calc(13 * 1rem / 16)", { lineHeight: "calc(15.6 * 1rem / 16)" }],
      },

      borderRadius: {
        32: "2rem",
        64: "4rem",
      },

      dropShadow: {
        button: [
          "0px 2px 8px rgba(0, 0, 0, 0.04)",
          "0px 10px 32px rgba(37, 57, 129, 0.04)",
        ],
      },
    },
  },

  plugins: [
    ({ addUtilities }) =>
      addUtilities({
        ".border-gradient": {
          "-webkit-mask":
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          webkitMaskComposite: "xor",
          maskComposite: "exclude",
        },
      }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-gradient": (angle) => ({
            "background-image": `linear-gradient(${angle}, var(--tw-gradient-stops))`,
          }),
        },
        {
          values: {
            ...theme("bgGradientDeg", {}),
            ...{
              81.5: "81.5deg",
            },
          },
        },
      );
    }),
  ],
};
