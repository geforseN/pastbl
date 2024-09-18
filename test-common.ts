export const endToEndTestsGlobs = [
  "tests-examples/**/*.spec.ts",
  "tests/**/*.spec.ts",
  "**/*.e2e.spec.ts",
];

export const nodejsTestsGlobs = ["{server,layers,app}/**/*.node.spec.ts"];

const oppositeGlob = (glob: string) => `!${glob}`;

export const vueTests = [
  "**/*.spec.ts",
  "!**/*.nuxt.spec.ts",
  ...endToEndTestsGlobs.map(oppositeGlob),
  ...nodejsTestsGlobs.map(oppositeGlob),
];
