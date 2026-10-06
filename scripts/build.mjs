#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { checkPlugin, parseSkill } from "./lib/check.mjs";
import { renderClaudeManifest, renderClaudeMarketplace, renderClaudeMcp, renderOpenAIMarketplace } from "./lib/render.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PLUGINS_DIR = path.join(ROOT, "plugins");
const DIST_DIR = path.join(ROOT, "dist");
const OPENAI_ZIP_ENTRIES = ["plugin.json", "mcp.json", "skills", "assets", "README.md"];

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));

async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function subdirectories(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

async function loadPlugin(dirName) {
  const dir = path.join(PLUGINS_DIR, dirName);
  const mcpFile = path.join(dir, "mcp.json");
  const skills = await Promise.all(
    (await subdirectories(path.join(dir, "skills"))).map(async (skillDir) => ({
      dir: skillDir,
      ...parseSkill(await readFile(path.join(dir, "skills", skillDir, "SKILL.md"), "utf8")),
    })),
  );
  return {
    dirName,
    dir,
    manifest: await readJson(path.join(dir, "plugin.json")),
    mcp: existsSync(mcpFile) ? await readJson(mcpFile) : null,
    skills,
  };
}

function zipForOpenAI(plugin) {
  const zipFile = path.join(DIST_DIR, `${plugin.manifest.name}-${plugin.manifest.version}.zip`);
  rmSync(zipFile, { force: true });
  const entries = OPENAI_ZIP_ENTRIES.filter((entry) => existsSync(path.join(plugin.dir, entry)));
  execFileSync("zip", ["-qrX", zipFile, ...entries, "-x", "*.DS_Store"], { cwd: plugin.dir, stdio: "inherit" });
  console.log(`packaged ${path.relative(ROOT, zipFile)}`);
}

const plugins = await Promise.all((await subdirectories(PLUGINS_DIR)).map(loadPlugin));
const errors = plugins.flatMap((plugin) =>
  checkPlugin({ ...plugin, fileExists: (rel) => existsSync(path.join(plugin.dir, rel)) }).map((error) => `plugins/${plugin.dirName}: ${error}`),
);
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

for (const plugin of plugins) {
  await writeJson(path.join(plugin.dir, ".claude-plugin", "plugin.json"), renderClaudeManifest(plugin.manifest));
  if (plugin.mcp) await writeJson(path.join(plugin.dir, ".mcp.json"), renderClaudeMcp(plugin.mcp));
}
const manifests = plugins.map((plugin) => plugin.manifest);
await writeJson(path.join(ROOT, ".claude-plugin", "marketplace.json"), renderClaudeMarketplace(manifests));
await writeJson(path.join(ROOT, ".agents", "plugins", "marketplace.json"), renderOpenAIMarketplace(manifests));

if (process.argv.includes("--zip")) {
  await mkdir(DIST_DIR, { recursive: true });
  plugins.forEach(zipForOpenAI);
}
