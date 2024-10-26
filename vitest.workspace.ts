import { parseArgs } from "node:util";
import { defaultExclude } from "vitest/config";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { endToEndTestsGlobs } from "./tests/e2e/utils.ts";
import { nodejsTestsGlobs } from "./tests/server/node/utils.ts";
import { nitroTestGlobs } from "./tests/server/nitro/utils.ts";

const allowedProjectsArray = ["nuxt", "nitro", "node"] as const;
const allowedProjects = new Set(allowedProjectsArray);
const isAllowedProject = (project: unknown) =>
  allowedProjects.has(project as typeof allowedProjectsArray[number]);

const parsedArgs = parseArgs({
  args: process.argv.slice(2),
  options: {
    project: {
      type: "string",
      default: <string[]>[...allowedProjectsArray],
      multiple: true,
    },
  },
});

const providedProjects = new Set(
  parsedArgs.values.project.filter((value) =>
    typeof value === "string"
    && isAllowedProject(value),
  ),
) as typeof allowedProjects;

export default [
  providedProjects.has("nuxt")
  && defineVitestConfig({
    test: {
      name: "nuxt",
      globals: true,
      environment: "nuxt",
      include: ["**/*.spec.ts"],
      exclude: defaultExclude.concat(
        endToEndTestsGlobs,
        nodejsTestsGlobs,
        nitroTestGlobs,
      ),
      environmentOptions: {
        nuxt: {
          mock: {
            intersectionObserver: true,
            indexedDb: true,
          },
        },
      },
    },
  }),
  providedProjects.has("nitro")
  && defineVitestConfig({
    test: {
      name: "nitro",
      include: [...nitroTestGlobs],
      environment: "nuxt",
    },
  }),
  providedProjects.has("node")
  && {
    test: {
      name: "node",
      environment: "node",
      include: [...nodejsTestsGlobs],
    },
  },
].filter(Boolean);
