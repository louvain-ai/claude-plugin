# Releasing

The plugin reaches people three ways, and one release reaches all of them:

- **Anthropic's directory** (claude.ai, Desktop, Cowork, and Claude Code through account sync). The directory follows `main`, and scans and publishes each new commit there.
- **This repository as a Claude Code marketplace.** Users get the new version with `claude plugin update louvain@louvain`, or automatically if they turned auto-update on.
- **ChatGPT.** ChatGPT does not read this repository. Its app is the MCP server itself, so a server change reaches it directly. A change to what the app's listing says goes through OpenAI's portal.

So **a merge to `main` is a release.** Protect `main`: require a pull request and a green `validate` check.

## Cutting a release

1. **Make the change on a branch.**
   - If it names a Louvain tool, check that the tool exists on the server.
   - Skills must never name a tool the server does not have.
2. **Raise the version.**
   - Raise `version` in `.claude-plugin/plugin.json`.
     - Patch: wording.
     - Minor: a new skill or behaviour.
     - Major: a removed skill or a changed server address.
   - Without a new version, users keep the old copy and `claude plugin update` reports "already at the latest version".
3. **Record it.** Move the `Unreleased` notes in `CHANGELOG.md` under the new version and date.
4. **Check locally.**
   ```bash
   claude plugin validate --strict .
   node scripts/check.mjs
   claude plugin marketplace add ./ && claude plugin install louvain@louvain   # then try /louvain:whoami
   ```
5. **Merge.** Open a pull request, wait for `validate`, and merge.
6. **Tag.**
   ```bash
   claude plugin tag --push      # creates louvain--v<version>
   ```
7. **Watch the directory.**
   - Open the plugin's page in the developer portal (claude.ai/directory/manage). The new commit is scanned before it is served.
   - If a version is held or fails the scan, fix it on a new commit. Don't force-push over it.

## Never

- Rename the plugin (`name` in `plugin.json`). Every existing install is recorded under that name. Change `displayName` instead.
- Add credentials, client ids or headers to `.mcp.json`. Sign-in is OAuth, and the person's browser does it.
- Add hooks or code that runs on the user's machine without a new review of what it does. It must then be described in the README; the directory's security scan looks for undisclosed behaviour.
- Give a skill a capability the server does not enforce. The server decides what a connection may do, and the plugin only describes it.
