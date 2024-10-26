// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import vueMacros from "@vue-macros/eslint-config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import vitest from "@vitest/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import pluginSecurity from "eslint-plugin-security";
import tailwind from "eslint-plugin-tailwindcss";

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

export default createConfigForNuxt({
  features: {
    stylistic: {
      arrowParens: true,
      blockSpacing: true,
      braceStyle: "1tbs",
      commaDangle: "always-multiline",
      indent: 2,
      jsx: true,
      quoteProps: "as-needed",
      quotes: "double",
      semi: true,
    },
  },
})
  .prepend(includeIgnoreFile(path.resolve(__dirname, ".gitignore")))
  .prepend({
    rules: vueMacros.rules,
    languageOptions: {
      globals: vueMacros.globals,
    },
  })
  .append({
    rules: {
      "no-console": "error",
      "no-unreachable-loop": "error",
      "@stylistic/max-len": ["error", {
        code: 100,
      }],
    },
  })
  .append({
    ...pluginSecurity.configs["recommended"],
    files: ["server", "layers/**/server"],
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
    files: ["tests/**/*.spec.ts", "{layers,app}/**/*.e2e.spec.ts"],
  })
  .append(tailwind.configs["flat/recommended"])
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
  .overrideRules({
    "vue/padding-line-between-blocks": ["error", "never"],
  })
  .override("unicorn/flat/recommended", {
    files: [...commonVueFilesPaths],
    rules: {
      "unicorn/prefer-top-level-await": "off",
    },
  });
