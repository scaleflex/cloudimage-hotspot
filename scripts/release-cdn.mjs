#!/usr/bin/env node
import { execSync } from "child_process";
import { resolve, dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const { run } = await import(pathToFileURL(join(homedir(), ".claude/skills/release-cdn/release-cdn.mjs")).href);

const exec = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });

// 1. CDN: bump version, build, upload, update refs
const { version } = await run({
  root,
  artifacts: {
    plugin: {
      versionKey: "version",
      cdnFileName: "hotspot.min.js",
      build(version) {
        exec("npm run build:bundle");
        return resolve(root, "dist/hotspot.min.js");
      },
    },
  },
  updateFiles: ["README.md", "demo/index.html"],
});

// 2. npm publish
console.log(`⏳ Publishing to npm...`);
exec("npm publish --access public");
console.log(`✓ Published to npm`);

// 3. Git commit, tag, push
console.log(`\n⏳ Committing and tagging...`);
exec("git add -A");
exec(`git commit -m "Release v${version}: bump version, update CDN URLs and dist bundles"`);
exec(`git tag v${version}`);
exec("git push && git push --tags");
console.log(`\n✅ Full release complete: v${version}`);
