import { includeIgnoreFile } from "@eslint/compat";
import withNuxt from "./.nuxt/eslint.config/flat";
import vueMacros from "@vue-macros/eslint-config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import playwright from "eslint-plugin-playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commonVueFilesPaths = /** @type {const} */ ([
  "app/app.vue",
  "app/components/**/*.vue",
  "app/layouts/**/*.vue",
  "app/pages/**/*.vue",
  "layers/**/component/**/*.vue",
  "layers/**/layouts/**/*.vue",
  "layers/**/pages/**/*.vue",
]);

const specFilesExtensions = /** @type {const} */ (["ts", "js"]);
const specDirectoriesNames = /** @type {const} */ ([
  "utils",
  "components",
  "composables",
]);

/** @param {string} base  */
function makeSpecPath(base) {
  if (!base.endsWith("/")) {
    base = base + "/";
  }
  return specFilesExtensions.flatMap((fileExtension) =>
    specDirectoriesNames.flatMap(
      (directoryName) => base + directoryName + "**/*.spec." + fileExtension,
    ),
  );
}

export default withNuxt()
  .prepend(includeIgnoreFile(path.resolve(__dirname, ".prettierignore")))
  .prepend(includeIgnoreFile(path.resolve(__dirname, ".gitignore")))
  .prepend({
    rules: vueMacros.rules,
    languageOptions: {
      globals: vueMacros.globals,
    },
  })
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
            "args",
            "dev-only",
            "indexed-db",
            "ref",
            /Ref$/ /* variables that end with Ref are used in Vue for DOM elements */,
            /[Pp]arams?/,
            /[Ff]n/,
            /[Pp]rops/,
            "e2e",
          ],
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: [
            /^use/,
            /^-/,
            /^\w+\.(get|head|post|put|delete|connect|options|trace|patch)\.ts$/,
          ],
          multipleFileExtensions: false,
        },
      ],
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
  })
  .append({
    files: [...makeSpecPath("app"), ...makeSpecPath("layers/**")],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  })
  .append({
    ...playwright.configs["flat/recommended"],
    files: ["tests/**"],
  });
