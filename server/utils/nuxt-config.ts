import path from "node:path";
import fs, { type PathLike } from "node:fs";
import url from "node:url";

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
  return getAbsoluteDirectoriesNames(path).filter(
    directoryHasNuxtConfigFileHasNuxtConfigFile,
  );
}

export function __dirname__(importMetaUrl: string) {
  return path.dirname(url.fileURLToPath(importMetaUrl));
}

export function __layersDirname__(importMetaUrl: string) {
  return path.join(__dirname__(importMetaUrl), "layers");
}
