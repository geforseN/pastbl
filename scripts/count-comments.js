import { readFileSync } from "fs";
import { execSync } from "child_process";

const diffOutput = execSync("git diff --name-only origin/main").toString();
const files = diffOutput.split("\n").filter(Boolean);

let todoCount = 0;
const todoRegex = /(?:\/\/|\/\*+|#|<!--)\s*todo\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

let fixmeCount = 0;
const fixmeRegex = /(?:\/\/|\/\*+|#|<!--)\s*fixme\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

let noteCount = 0;
const noteRegex = /(?:\/\/|\/\*+|#|<!--)\s*note\b[\s\S]*?(?:\*\/|-->|\n|$)/i;

for (const file of files) {
  const content = readFileSync(file, "utf-8");

  const lines = content.split("\n");
  for (const line of lines) {
    if (todoRegex.test(line)) {
      todoCount++;
    }
    if (fixmeRegex.test(line)) {
      fixmeCount++;
    }
    if (noteRegex.test(line)) {
      noteCount++;
    }
  }
}

const commentBody = `
## Summary of Comments

- **TODOs**: ${todoCount}
- **FIXMEs**: ${fixmeCount}
- **NOTEs**: ${noteCount}

---

Please address the above comments before merging.
`;

// eslint-disable-next-line no-console
console.log(commentBody);
