import path from "node:path";
import fs, { type PathLike } from "node:fs";

function getAbsoluteDirectoriesNames(directoryPath: PathLike) {
  directoryPath = directoryPath.toString();
  const files = fs.readdirSync(directoryPath);
  const directoryNames = files.filter((file) =>
    fs.statSync(path.join(directoryPath, file)).isDirectory(),
  );
  const directoryPaths = directoryNames.map((directoryName) =>
    path.join(directoryPath, directoryName),
  );
  return directoryPaths;
}

const nuxtConfigExtensions = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".mjc",
  ".cts",
]);

function directoryHasNuxtConfigFileHasNuxtConfigFile(directoryPath: string) {
  const contents = fs.readdirSync(directoryPath);
  const nuxtConfigFile = contents.find((content) => {
    const contentPath = path.join(directoryPath, content);
    const isFile = fs.statSync(contentPath).isFile();
    if (!isFile) {
      return false;
    }
    const extension = path.extname(content);
    return (
      content.startsWith("nuxt.config") && nuxtConfigExtensions.has(extension)
    );
  });
  return nuxtConfigFile !== undefined;
}

export function findNuxtLayers(path: PathLike) {
  return getAbsoluteDirectoriesNames(path).filter(directoryHasNuxtConfigFileHasNuxtConfigFile);
}
