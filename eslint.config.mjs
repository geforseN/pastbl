import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

const commonVueFilesPaths = /** @type {const} */ ([
  "app.vue",
  "./components/**/*.vue",
  "./layouts/**/*.vue",
  "./pages/**/*.vue",
]);

export default withNuxt()
  .overrideRules({
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
  })
  .append({
    rules: {
      "no-console": "error",
      "no-unreachable-loop": "error",
    },
  })
  .append(eslintPluginUnicorn.configs["flat/recommended"])
  .override("unicorn/flat/recommended", {
    rules: {
      "unicorn/no-array-reduce": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          ignore: [
            /Ref$/ /* variables that end with Ref are used in vue for DOM elements */,
            "ref",
            "params",
            /Param/,
            "fn",
            /Fn/,
            "args",
            "props",
            "dev-only",
          ],
        },
      ],
      "unicorn/numeric-separators-style": [
        "error",
        {
          number: {
            minimumDigits: 4,
          },
        },
      ],
      /* TODO: specify this rule, do not use "off" */
      "unicorn/filename-case": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/catch-error-name": [
        "error",
        {
          ignore: ["reason"],
        },
      ],
      "unicorn/no-nested-ternary": "off",
    },
  })
  .overrideRules({
    files: commonVueFilesPaths,
    "unicorn/prefer-top-level-await": "off",
  });
