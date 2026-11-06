# Changelog

This project follows [Semantic Versioning](https://semver.org/). The version in
`.claude-plugin/plugin.json` is the release. Users stay on a version until it changes, so every
release raises it.

## [Unreleased]

## [1.0.0] - 2026-11-05

First public release.

- Licensed by Louvain AI Ltd.
- Claude asks before each save or other change it makes in Louvain, because Louvain's tools now declare every change.
- The approval screen's switch is **Make changes for you**, and the README lists what it allows.
- A 1024 px square icon (`assets/icon.png`), and the privacy policy URL stated in the manifest.
- The `louvain` skill says what `fast` does and which files `louvain_update` reaches, as the server has them.

## [0.1.0] - 2026-09-26

First release, before directory submission.

- Louvain's MCP server at `https://louvain.ai/api/mcp`. Sign-in is OAuth in the browser; the plugin holds no credentials.
- `louvain` skill: when to ask Louvain, how to read its answers (refusals, inferred text, dated state, agent-saved files), and when saving is allowed.
- `/louvain:ask`, `/louvain:save` and `/louvain:whoami`.
- Marketplace file, so Claude Code can install from this repository.
