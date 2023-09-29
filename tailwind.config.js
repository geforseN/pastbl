const daisyuiThemes = require("daisyui/src/theming/themes");

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes["[data-theme=light]"],
        },
      },
      {
        dark: {
          ...daisyuiThemes["[data-theme=dark]"],
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
