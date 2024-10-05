/* eslint-disable no-console */
// @ts-check
import { readFile, writeFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * @param {string} outputFilePath
 */
async function main(outputFilePath) {
  const { stdout: diffOutput } = await execPromise(
    "git diff --name-only origin/main",
  );
  const files = diffOutput.split("\n").filter(Boolean);

  if (files.length === 0) {
    console.log("No files changed.");
    process.exit(0);
  }

  const words = ["todo", "fixme", "note"].map(Word.create);

  const settled = await Promise.allSettled(
    files.map(async (file) => {
      const content = await readFile(file, "utf-8").catch((cause) => {
        throw new Error(`Error reading file: ${file}`, { cause });
      });

      const lines = content.split("\n").filter(Boolean);

      for (const [index, line] of lines.entries()) {
        words.find((word) => word.match(line))?.addEntry(file, index + 1);
      }
    }),
  );

  for (const result of settled) {
    if ("reason" in result) {
      console.log(result.reason);
    }
  }

  const summary = new WordsSummary(words).create();

  await writeFile(outputFilePath, summary);

  console.log(
    `Report generated and saved to ${outputFilePath}, summary: ${summary}`,
  );
}

class WordEntries {
  /**
   *
   * @param {Set<[string, number]>} entries
   */
  constructor(entries = new Set()) {
    this.entries = entries;
  }

  /**
   * @param {string} file
   * @param {number} lineNumber
   */
  add(file, lineNumber) {
    this.entries.add([file, lineNumber]);
  }

  get size() {
    return this.entries.size;
  }

  format() {
    if (!this.size) {
      return "None";
    }

    return `${this.size}\n` + Array.from(this.entries)
      .map(([file, lineNumber]) => ` - **${file}:${lineNumber}**`)
      .join("\n");
  }
}

class Word {
  /**
   * @param {string} keyword
   * @param {RegExp} regex
   * @param {WordEntries} entries
   */
  constructor(keyword, regex, entries) {
    this.keyword = keyword;
    this.regex = regex;
    this.entries = entries;
  }

  /**
   * @param {string} keyword
   */
  static create(keyword) {
    return new Word(keyword, createCommentRegex(keyword), new WordEntries());
  }

  format() {
    return `${this.keyword.toUpperCase()}s: ${this.entries.format()}`;
  }

  /**
   * @param {string} file
   * @param {number} lineNumber
   */
  addEntry(file, lineNumber) {
    return this.entries.add(file, lineNumber);
  }

  /**
   * @param {string} line
   */
  match(line) {
    return this.regex.test(line);
  }
}

/**
 * @param {string} keyword
 * @returns {RegExp}
 */
function createCommentRegex(keyword) {
  return new RegExp(
    `(?:\\/\\/|\\/\\*+|#|<!--)\\s*${keyword}\\b[\\s\\S]*?(?:\\*\\/|-->|\n|$)`,
    "i",
  );
}

class WordsSummary {
  /**
   * @param {Array<Word>} words
   */
  constructor(words) {
    this.words = words;
  }

  create() {
    return `
## Summary of Comments

${this.words.map((word) => word.format()).join("\n\n")}

---

Please address the above comments before merging.
`;
  }
}

const outputFilePath = process.argv[2];

if (!outputFilePath) {
  console.error("Error: No output file path provided.");
  process.exit(1);
}

main(outputFilePath).catch((err) => {
  console.error("Error occurred during execution:", err);
  process.exit(1);
});
