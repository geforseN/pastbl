import { parseArgs } from "node:util";
import { defineNuxtVitestConfig } from "./tests/client/nuxt/utils.ts";
import { defineNitroVitestConfig } from "./tests/server/nitro/utils.ts";
import { defineNodeVitestConfig } from "./tests/server/node/utils.ts";

const allowedProjectsArray = ["nuxt", "nitro", "node"] as const;
type Project = (typeof allowedProjectsArray)[number];

function isAllowedProject(project: unknown): project is Project {
  return allowedProjectsArray.includes(project as Project);
}

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

const providedProjects = new Set<Project>(
  parsedArgs.values.project.filter(isAllowedProject)
);

export default [
  providedProjects.has("nuxt") && defineNuxtVitestConfig(),
  providedProjects.has("nitro") && defineNitroVitestConfig(),
  providedProjects.has("node") && defineNodeVitestConfig(),
].filter(Boolean);
