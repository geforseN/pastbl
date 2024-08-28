import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

// LINK: https://www.conventionalcommits.org/en/v1.0.0/
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      // LINK: https://github.com/pvdlg/conventional-changelog-metahub?tab=readme-ov-file#commit-types
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
