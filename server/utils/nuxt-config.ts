import path from "node:path";
import fs, { type PathLike } from "node:fs";

function getAbsoluteDirectoriesNames(dirPath: PathLike) {
  dirPath = dirPath.toString();
  const files = fs.readdirSync(dirPath);
  const dirNames = files.filter((file) =>
    fs.statSync(path.join(dirPath, file)).isDirectory(),
  );
  const dirPaths = dirNames.map((dirName) => path.join(dirPath, dirName));
  return dirPaths;
}

const nuxtConfigExtensions = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".mjc",
  ".cts",
]);

function dirHasNuxtConfigFile(dirPath: string) {
  const contents = fs.readdirSync(dirPath);
  const nuxtConfigFile = contents.find((content) => {
    const contentPath = path.join(dirPath, content);
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
  return getAbsoluteDirectoriesNames(path).filter(dirHasNuxtConfigFile);
}
