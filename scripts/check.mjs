#!/usr/bin/env node
/**
 * The checks the Claude directory's portal applies and `claude plugin validate` does not.
 * Run in CI after `claude plugin validate --strict .`, and locally before a release.
 *
 * - the README has at least 40 words outside code blocks (the portal blocks fewer)
 * - no macOS/Windows system files, no binaries other than PNG/JPEG/GIF/WebP images
 * - no file over 256 KiB unless it is an image (the portal holds larger ones for a reviewer)
 * - no remote MCP server carries headers, a client id or anything credential-shaped: the plugin
 *   authenticates through OAuth in the person's browser and holds nothing
 * - every remote MCP server URL is https
 * - the marketplace entry name matches the manifest name, and the manifest has a version
 *
 * Node's standard library only: this repository installs nothing.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const failures = [];
const fail = (message) => failures.push(message);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const files = walk(root);
const SYSTEM_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);
const IMAGES = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const TEXT = new Set([".md", ".json", ".yml", ".yaml", ".mjs", ".js", ".txt", ".svg", ""]);

for (const path of files) {
  const rel = relative(root, path);
  const base = rel.split("/").pop();
  if (SYSTEM_FILES.has(base) || rel.includes("__MACOSX")) fail(`${rel}: system file`);
  const ext = extname(base).toLowerCase();
  if (!TEXT.has(ext) && !IMAGES.has(ext))
    fail(`${rel}: a binary the directory would hold for a reviewer`);
  if (!IMAGES.has(ext) && statSync(path).size > 256 * 1024) fail(`${rel}: over 256 KiB`);
}

const readme = readFileSync(join(root, "README.md"), "utf8").replace(/```[\s\S]*?```/g, "");
const words = readme.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length;
if (words < 40) fail(`README.md: ${words} words outside code blocks, the directory needs 40`);

const manifest = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"));
const marketplace = JSON.parse(readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"));
if (!manifest.version) fail("plugin.json: no version, so users would never receive an update");
if (!marketplace.plugins?.some((p) => p.name === manifest.name)) {
  fail(`marketplace.json: no entry named "${manifest.name}", the manifest's name`);
}

const mcp = JSON.parse(readFileSync(join(root, ".mcp.json"), "utf8"));
for (const [name, server] of Object.entries(mcp.mcpServers ?? {})) {
  if (server.type !== "http") fail(`.mcp.json ${name}: expected a remote http server`);
  if (!/^https:\/\//.test(server.url ?? "")) fail(`.mcp.json ${name}: url is not https`);
  for (const key of ["headers", "headersHelper", "env", "oauth"]) {
    if (key in server)
      fail(`.mcp.json ${name}: "${key}" — the plugin carries no credentials or client identity`);
  }
}

const SECRET =
  /(louvain_agent_[A-Za-z0-9]{8,}|sk-[A-Za-z0-9]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,})/;
for (const path of files) {
  const ext = extname(path).toLowerCase();
  if (!TEXT.has(ext)) continue;
  const text = readFileSync(path, "utf8");
  if (SECRET.test(text)) fail(`${relative(root, path)}: looks like a credential`);
}

if (failures.length) {
  console.error(failures.map((f) => `✘ ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✔ directory checks passed (${files.length} files, README ${words} words)`);
