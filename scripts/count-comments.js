/* eslint-disable no-console */
// @ts-check
import { readFile, writeFile } from "node:fs/promises";
import child_process from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(child_process.exec);

/**
 * @param {string} outputFilePath
 */
async function main(outputFilePath) {
  const { stdout: diffOutput } = await exec("git diff --name-only origin/main");
  const files = diffOutput.split("\n").filter(Boolean);

  if (files.length === 0) {
    console.log("No files changed.");
    process.exit(0);
  }

  const comments = ["todo", "fixme", "note"].map(Comment.create);

  const settled = await Promise.allSettled(
    files.map(async (file) => {
      const content = await readFile(file, "utf-8").catch((cause) => {
        throw new Error(`Error reading file: ${file}`, { cause });
      });

      const lines = content.split("\n").filter(Boolean);

      for (const [index, line] of lines.entries()) {
        comments
          .find((comment) => comment.match(line))
          ?.addEntry(CommentEntry.fromLine(file, index));
      }
    }),
  );

  for (const result of settled) {
    if ("reason" in result) {
      console.log(result.reason);
    }
  }

  const summary = await new GithubCommentsSummary(comments).create();

  await writeFile(outputFilePath, summary);

  console.log(
    `Report generated and saved to ${outputFilePath}, summary: ${summary}`,
  );
}

class CommentEntry {
  /**
   * @param {string} baseUrl
   */
  asHtmlLink(baseUrl) {
    const { file, lineNumber } = this;
    return `<a href="${baseUrl}${file}#L${lineNumber}" target="_blank">${file}:${lineNumber}</a>`;
  }

  /**
   * @param {string} file
   * @param {number} lineNumber
   */
  constructor(file, lineNumber) {
    this.file = file;
    this.lineNumber = lineNumber;
  }

  /**
   * @param {string} file
   * @param {number} index
   */
  static fromLine(file, index) {
    return new CommentEntry(file, index + 1);
  }
}

class CommentsEntries {
  /**
   * @param {Set<CommentEntry>} entries
   */
  constructor(entries = new Set()) {
    this.entries = entries;
  }

  /**
   * @param {CommentEntry} commentEntry
   */
  add(commentEntry) {
    this.entries.add(commentEntry);
  }

  get size() {
    return this.entries.size;
  }

  countAsString() {
    if (!this.size) {
      return "None";
    }
    return String(this.size);
  }

  /**
   * @param {string} baseUrl
   */
  asHtmlListItems(baseUrl) {
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    return Array.from(this.entries).map(
      (entry) => `<li>${entry.asHtmlLink(baseUrl)}</li>`,
    );
  }
}

class Comment {
  /**
   * @param {string} keyword
   * @param {RegExp} regex
   * @param {CommentsEntries} entries
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
    return new Comment(
      keyword,
      createCommentRegex(keyword),
      new CommentsEntries(),
    );
  }

  /**
   * @param {string} baseUrl
   */
  asHtml(baseUrl) {
    const heading = `${this.keyword.toUpperCase()}s: ${this.entries.countAsString()}`;
    if (!this.entries.size) {
      return heading;
    }

    return `
<details><summary>${heading}</summary>
<ul>
  ${this.entries.asHtmlListItems(baseUrl).join("\n  ")}
</ul>
</details>
`;
  }

  /**
   * @param {CommentEntry} commentEntry
   */
  addEntry(commentEntry) {
    return this.entries.add(commentEntry);
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

class GithubCommentsSummary {
  /**
   * @param {Array<Comment>} comments
   */
  constructor(comments) {
    this.comments = comments;
  }

  async #getBaseUrl() {
    const [{ stdout: gitHash }, { stdout: gitUrl }] = await Promise.all([
      exec("git log -1 --format=%H"),
      exec("git config --get remote.origin.url"),
    ]);
    console.debug({ gitHash, gitUrl });
    if (typeof gitUrl !== "string") {
      throw new Error("Error: Git URL not string, received: " + gitUrl);
    }
    if (typeof gitHash !== "string") {
      throw new Error("Error: Git hash not string, received: " + gitHash);
    }
    const baseUrl = gitUrl.trim().replace(".git", `/blob/${gitHash.trim()}/`);
    return baseUrl;
  }

  async create() {
    const baseUrl = await this.#getBaseUrl();
    const summaries = this.comments.map((comment) => comment.asHtml(baseUrl));
    return `
## Summary of Comments

${summaries.join("\n\n")}

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
