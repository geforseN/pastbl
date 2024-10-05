import { readFileSync } from "fs";
import { execSync } from "child_process";

const diffOutput = execSync("git diff --name-only origin/main").toString();
const files = diffOutput.split("\n").filter(Boolean);

let todoCount = 0;
const todoEntries = [];
const todoRegex = /(?:\/\/|\/\*+|#|<!--)\s*todo\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

let fixmeCount = 0;
const fixmeEntries = [];
const fixmeRegex = /(?:\/\/|\/\*+|#|<!--)\s*fixme\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

let noteCount = 0;
const noteEntries = [];
const noteRegex = /(?:\/\/|\/\*+|#|<!--)\s*note\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
    const line = lines[lineNumber];

    if (todoRegex.test(line)) {
      todoCount++;
      todoEntries.push([file, lineNumber]);
    }
    if (fixmeRegex.test(line)) {
      fixmeCount++;
      fixmeEntries.push([file, lineNumber]);
    }
    if (noteRegex.test(line)) {
      noteCount++;
      noteEntries.push([file, lineNumber]);
    }
  }
}

/**
 * @param {string[]} entries
 * @param {number} count
 * @returns {string}
 * */
function formatCount(entries, count) {
  return entries.length
    ? ` - ${count} 
  - ${entries
    .map(
      ([file, lineNumber]) =>
        `**${file}:${lineNumber}**`,
    )
    .join("\n")}`
    : " - None";
}

// eslint-disable-next-line no-console
console.log(`
## Summary of Comments

- **TODOs**: ${formatCount(todoEntries, todoCount)}

- **FIXMEs**: ${formatCount(fixmeEntries, fixmeCount)}

- **NOTEs**: ${formatCount(noteEntries, noteCount)}

---

Please address the above comments before merging.
`);
