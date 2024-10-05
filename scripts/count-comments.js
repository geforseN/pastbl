import { readFileSync } from "fs";
import { execSync } from "child_process";

try {
  const diffOutput = execSync("git diff --name-only origin/main").toString();
  const files = diffOutput.split("\n").filter(Boolean);

  if (files.length === 0) {
    // eslint-disable-next-line no-console
    console.log("No files changed.");
    process.exit(0);
  }

  let todoCount = 0;
  const todoEntries = [];
  const todoRegex = /(?:\/\/|\/\*+|#|<!--)\s*todo\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

  let fixmeCount = 0;
  const fixmeEntries = [];
  const fixmeRegex
    = /(?:\/\/|\/\*+|#|<!--)\s*fixme\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

  let noteCount = 0;
  const noteEntries = [];
  const noteRegex = /(?:\/\/|\/\*+|#|<!--)\s*note\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

  for (const file of files) {
    if (!file) continue;
    try {
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
        const line = lines[lineNumber - 1];

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
    catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error reading file: ${file}`, err);
    }
  }

  function formatCount(entries, count) {
    return entries.length
      ? ` - ${count} 
  - ${entries
    .map(([file, lineNumber]) => `**${file}:${lineNumber}**`)
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
}
catch (error) {
  // eslint-disable-next-line no-console
  console.error("Error during script execution: ", error);
  process.exit(1);
}
