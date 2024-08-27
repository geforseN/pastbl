import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

// LINK: https://www.conventionalcommits.org/en/v1.0.0/
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
} satisfies UserConfig;
