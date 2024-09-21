export const endToEndTestsGlobs = [
  "tests/**/*.spec.ts",
  "{layers,app}/**/*.e2e.spec.ts",
];

export const nodejsTestsGlobs = ["{server,layers,app}/**/*.node.spec.ts"];

const oppositeGlob = (glob: string) => `!${glob}`;

export const nitroTestsGlobs = ["server/**/*.spec.ts"];

export const vueTests = [
  "**/*.spec.ts",
  "!**/*.nuxt.spec.ts",
  ...nitroTestsGlobs.map(oppositeGlob),
  ...endToEndTestsGlobs.map(oppositeGlob),
  ...nodejsTestsGlobs.map(oppositeGlob),
];
