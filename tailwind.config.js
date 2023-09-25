/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "emerald",
      {
        "emerald-dark": {
          primary: "#0d7ea1",
          secondary: "#1da6ad",
          accent: "#523004",
          neutral: "#241e2b",
          "base-100": "#22323c",
          info: "#132167",
          success: "#155d2f",
          warning: "#9d560b",
          error: "#a52011",
        },
      },
    ],
    logs: false,
  },
};
