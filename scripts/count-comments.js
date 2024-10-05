/* eslint-disable no-console */
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

const {
  GITHUB_EVENT_PULL_REQUEST_NUMBER: prNumber,
  GITHUB_REPOSITORY: repo,
  GITHUB_TOKEN: token,
} = process.env.GITHUB_EVENT_PULL_REQUEST_NUMBER;

if (!prNumber || !repo || !token) {
  console.error("Required environment variables are missing.");
  if (!prNumber) {
    console.error("Missing GITHUB_EVENT_PULL_REQUEST_NUMBER.");
  }
  if (!repo) {
    console.error("Missing GITHUB_REPOSITORY.");
  }
  if (!token) {
    console.error("Missing GITHUB_TOKEN.");
  }
  process.exit(1);
}

const [owner, repoName] = repo.split("/");
const url = `https://api.github.com/repos/${owner}/${repoName}/issues/${prNumber}/comments`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  },
  body: JSON.stringify({ body: commentBody }),
});

if (response.ok) {
  console.log("Comment added to pull request successfully.");
}
else {
  console.error("Failed to add comment to pull request.");
}
