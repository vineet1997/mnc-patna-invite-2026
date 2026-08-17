import { rm } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const nextOutput = path.resolve(projectRoot, ".next");

if (path.dirname(nextOutput) !== projectRoot || path.basename(nextOutput) !== ".next") {
  throw new Error("Refusing to clear an unexpected build directory.");
}

await rm(nextOutput, { recursive: true, force: true });
