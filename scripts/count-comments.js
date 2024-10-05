/* eslint-disable no-console */
// @ts-check
import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

const outputFilePath = process.argv[2];

if (!outputFilePath) {
  console.error("Error: No output file path provided.");
  process.exit(1);
}

main(outputFilePath);

/**
 * @param {string} outputFilePath
 */
function main(outputFilePath) {
  const words = [new Word("todo"), new Word("fixme"), new Word("note")];

  const diffOutput = exec("git diff --name-only origin/main").toString();
  const files = diffOutput.split("\n").filter(Boolean);

  if (files.length === 0) {
    console.log("No files changed.");
    process.exit(0);
  }

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n").filter(Boolean);

    for (const [index, line] of lines.entries()) {
      words
        .find((word) => word.match(line))
        ?.addEntry(file, index + 1);
    }
  }

  const summary = new WordsSummary(words).create();

  writeFileSync(outputFilePath, summary);

  console.log(`Report generated and saved to ${outputFilePath}, summary: ${summary}`);
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

class WordEntries {
  /**
   *
   * @param {Set<[string, number]>} entries
   */
  constructor(entries) {
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

    return "\n" + Array.from(this.entries)
      .map(([file, lineNumber]) => ` - **${file}:${lineNumber}**`)
      .join("\n");
  }
}

class Word {
  /**
   * @param {string} keyword
   */
  constructor(keyword) {
    this.keyword = keyword;
    this.regex = createCommentRegex(keyword);
    this.entries = new WordEntries(new Set());
  }

  format() {
    return `${this.keyword.toUpperCase()}s: - ${this.entries.format()}`;
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
