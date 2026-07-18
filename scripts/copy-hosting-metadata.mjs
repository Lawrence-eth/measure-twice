import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, ".openai/hosting.json");
const destination = resolve(projectRoot, "dist/.openai/hosting.json");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);

console.log("Copied Sites hosting metadata into dist/.openai/hosting.json");
