import withNuxt from "~/.nuxt/eslint.config.mjs";

export default withNuxt({
  overrides: {
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "never",
        },
        svg: "always",
        math: "always",
      },
    ],
  },
});
