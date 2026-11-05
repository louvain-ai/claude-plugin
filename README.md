# Louvain for Claude

![Louvain](assets/mark-blue.svg)

Louvain is your company's memory: your mail, documents, chats and calendar, and the facts recorded from them. It is fenced to exactly what you are permitted to see.

This plugin connects Claude to Louvain and teaches Claude to use it well:

- Claude asks Louvain before searching the web.
- Claude reports a refusal as an answer rather than rephrasing the question.
- Claude offers what Louvain *infers* as a suggestion, never as a fact.
- Claude saves to Louvain only what you ask it to keep.

Every figure, date and name in a Louvain answer has been checked against the source that states it.

## What you get

| | |
|---|---|
| **Louvain tools** | Louvain's MCP server, at `https://louvain.ai/api/mcp`. |
| **Guidance skill** | Tells Claude when to reach for Louvain and how to read its answers. |
| `/louvain:ask <question>` | Ask a question and get a verified answer with its sources. |
| `/louvain:save [title]` | Save something Claude wrote for you to your private *Saved by agents* space. |
| `/louvain:whoami` | Check the connection: who it acts for, what it can read, whether it can save. |

The `/louvain:` commands work in Claude Code and Cowork. On claude.ai the skills load, and Claude applies them when they fit.

## Install

You need a Louvain account. Sign up or sign in at [louvain.ai](https://louvain.ai).

### Claude (web, desktop) and Cowork

1. Go to **Customize → Plugins → Discover**, find **Louvain** and select **Add**.
2. On the plugin's **Connectors** tab, connect Louvain.
3. A Louvain window opens. Sign in and approve.

A plugin you add on claude.ai also appears in Claude Code when you sign in there, as `louvain@synced`.

### Claude Code, from this repository

```bash
claude plugin marketplace add louvain-ai/claude-plugin
claude plugin install louvain@louvain
```

Then run `/mcp` in Claude Code, choose **louvain** and pick **Authenticate**. Your browser opens Louvain's approval page.

If you already added Louvain by hand with `claude mcp add`, remove that entry with `claude mcp remove louvain`, so that Claude sees one set of Louvain tools, not two.

### Approving the connection

Louvain's approval page states what the connection may do:

- **Read.** It reads exactly what you can read. It cannot see your colleagues' sources, change a setting, invite anyone, or act with your role, even if you are an owner.
- **Make changes for you** is optional and **off unless you turn it on**. With it, Claude can work as you, labelled as an AI agent, in your private *Saved by agents* space and in spaces you edit whose admin hasn't blocked agents:
  - save, copy, move and rename files and folders, and save new versions of files, with earlier versions kept;
  - post in a file's discussion and change your plate;
  - delete empty folders and files only agents wrote, which stay in Recently deleted for 30 days.

  Moving something to another space changes who can read it. Claude can't share anything, change who a space is shared with, delete a space or a file a person wrote, or delete anything for good. Claude asks you before each change it makes in Louvain.

The connection lasts 30 days, then Louvain asks you to approve again. It ends at once when you disconnect it, when you leave the workspace, or when an administrator ends it.

### Self-hosted Louvain

This plugin points at the hosted service, `louvain.ai`. For your own deployment, connect Claude to your server's URL directly:

- **Claude Code:** `claude mcp add --transport http louvain https://<your-louvain>/api/mcp`
- **Claude (web, desktop):** go to **Settings → Connectors → Add custom connector** and paste `https://<your-louvain>/api/mcp`.

## What this plugin runs, sends and stores

This plugin is text: four skills and one server address. It runs no code on your computer, installs no packages, reads no environment variables and contains no credentials.

- **Where it connects.** One place: `https://louvain.ai/api/mcp`, plus Louvain's sign-in pages on `louvain.ai`. Claude connects only when you have connected Louvain.
- **What Louvain receives.** The arguments of each tool call Claude makes, for example your question or a search phrase. Louvain does not receive your conversation.
- **What Louvain keeps.**
  - Every question and answer, in your answer history. Only you can see the words of your questions. Your workspace's administrators see counts, refusals, response times and feedback, never the words.
  - Files you asked Claude to save. They are labelled as written by an agent, and only the readers of the space they were saved in can see them.
  - A record that the connection was approved and when it was last used.
- **Sign-in.** Uses OAuth in your browser. Your Louvain password never reaches Claude or this plugin.

Privacy policy: <https://louvain.ai/privacy>. See also [`PRIVACY.md`](PRIVACY.md).

## Disconnecting

- In Louvain: **Connections → Agents → Disconnect**. It takes effect immediately.
- In Claude Code: `/mcp`, then **Clear authentication**, or `claude plugin uninstall louvain`.
- In Claude: **Customize → Plugins**, then remove Louvain.

## Support

- Support: support@louvain.ai
- Security: security@louvain.ai
- Documentation: <https://louvain.ai/docs/agents>

## Testing the plugin against louvain.ai

Test before submitting, and again after any change to a skill. Each step either passes or names what broke.

1. **Validate the files.**
   ```bash
   claude plugin validate --strict . && node scripts/check.mjs
   ```
   Both print a ✔.
2. **Load this checkout in Claude Code**, without installing it:
   ```bash
   claude --plugin-dir .
   ```
   To see what it loads first, run `claude --plugin-dir . plugin details louvain`. It lists four skills (`ask`, `louvain`, `save`, `whoami`) and one MCP server. If you had added Louvain by hand, run `claude mcp remove louvain` first, so that the tools you test are the plugin's.
3. **Sign in.** Run `/mcp`, choose **louvain** and pick **Authenticate**. Your browser opens Louvain's approval page. It should:
   - name the client as a program on this computer;
   - list what it may read;
   - show **Make changes for you** turned off.

   Turn it on only if you want to test saving, then approve. `/mcp` then shows louvain as connected.
4. **Check the connection.** Run `/louvain:whoami`. It should name you and your workspace and show a readable-source count above 0. A count of 0 means your sources haven't finished connecting.
5. **Ask.** Run `/louvain:ask` with something your sources know, then with something they don't.
   - The first answer cites its sources.
   - The second is a plain refusal that lists what the sources do establish, and Claude does not rephrase and retry.
6. **Let the skill choose.** Without a slash command, ask an ordinary question about your work, such as "who owns the Acme renewal?". Claude should call `louvain_ask` before searching the web.
7. **Save**, if you turned saving on. Run `/louvain:save Test note`. Claude confirms the title and the private space before saving. The file then appears in Louvain under **Saved by agents**, labelled as written by an agent.
8. **Disconnect.** In Louvain, go to **Connections → Agents → Disconnect**. The next `/louvain:whoami` fails to authorise, which proves that disconnecting takes effect at once.

**On claude.ai.** A plugin can only be added there from a marketplace, the directory or an upload. Before this repository is public, zip it and use **Customize → Plugins → Add → Upload plugin**. Then connect Louvain on the plugin's **Connectors** tab and repeat steps 4–7 in a chat. Hooks and agents don't load in chat, and this plugin has neither.

**In ChatGPT (developer mode).** ChatGPT connects to the server itself; the skills are a separate submission.
- Go to **Settings → Security and login → Developer mode**, turn it on, then add `https://louvain.ai/api/mcp` under **Plugins**.
- Sign in. If ChatGPT asks for identity, the approval page shows "Know it's you" and "See your email address" as plain lines.
- Then repeat steps 4–5 by asking in chat.
- Check whether the save tools appear. That is still unconfirmed for ChatGPT.

## For maintainers

See [`RELEASING.md`](RELEASING.md) and [`CHANGELOG.md`](CHANGELOG.md). CI validates the manifests on every push (`.github/workflows/validate.yml`).

The Louvain mark in `assets/` is Louvain's own. No other company's logo is used anywhere in this repository.
