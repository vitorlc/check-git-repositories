const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { EOL } = require("os");

function find_between(s, first, last) {
  try {
    if (s.indexOf(first) == -1) return "";
    const start = s.indexOf(first) + first.length;
    const end = s.indexOf(last, start);
    return s.substring(start, end).trim();
  } catch (e) {
    return "";
  }
}

const bcolors = {
  HEADER: "\x1b[95m",
  OKBLUE: "\x1b[94m",
  OKCYAN: "\x1b[96m",
  OKGREEN: "\x1b[92m",
  WARNING: "\x1b[93m",
  FAIL: "\x1b[91m",
  ENDC: "\x1b[0m",
  BOLD: "\x1b[1m",
  UNDERLINE: "\x1b[4m",
};

const rootDir = process.cwd();
console.log(
  `${bcolors.BOLD}${bcolors.HEADER}Repository - Branch - Info${bcolors.ENDC}`
);
fs.readdirSync(".").forEach((dirName) => {
  const dirPath = path.join(rootDir, dirName);
  if (fs.statSync(dirPath).isDirectory()) {
    process.chdir(dirPath);
    try {
      execSync("git branch", { stdio: "ignore" });
      const output = execSync("git status", { encoding: "utf-8" });
      const split = output.split(EOL);
      const untrackedRaw = find_between(output, "Untracked files:", EOL + EOL);
      const untracked = untrackedRaw.replace(/\(.*?\)/g, "").trim();
      const modifiedRaw = find_between(
        output,
        "Changes not staged for commit:",
        EOL + EOL
      );
      const modifiedRaw2 = modifiedRaw.replace(/\(.*?\)/g, "");
      const modified = modifiedRaw2.replace(/modified:/g, "").trim();
      let data = `${bcolors.OKBLUE}${dirName}${bcolors.ENDC} - ${
        split[0].split(" ")[split[0].split(" ").length - 1]
      } - `;
      const outOfDate = [];
      if (output.includes("nothing to commit")) {
        data += `${bcolors.OKGREEN}Updated${bcolors.ENDC}`;
      }
      if (untracked) {
        const countUntracked = untracked.split(EOL).length;
        outOfDate.push(
          `${bcolors.WARNING}${countUntracked} Untracked files${bcolors.ENDC}`
        );
      }
      if (modified) {
        const countChanges = modified.split(EOL).length;
        outOfDate.push(
          `${bcolors.WARNING}${countChanges} modifications${bcolors.ENDC}`
        );
      }
      if (untracked || modified) {
        data +=
          `${bcolors.WARNING}Out of Date - ${bcolors.ENDC}` +
          outOfDate.join(" and ");
      }
      console.log(data);
    } catch (e) {
      //   console.log(`Error: ${e.message}`);
    }
    process.chdir(rootDir);
  }
});
