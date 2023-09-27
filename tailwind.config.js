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
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
        },
        ".btn-twitch~~todo": {
          "background-color": "#1EA1F1",
          "border-color": "#1EA1F1",
        },
        ".btn-twitch:hover~~todo": {
          "background-color": "#1C96E1",
          "border-color": "#1C96E1",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
