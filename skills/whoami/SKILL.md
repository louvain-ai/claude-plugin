---
name: whoami
description: Check the Louvain connection. Shows who it acts for, which workspace, how much it can read, whether it can save, and how to disconnect.
disable-model-invocation: true
---

Check the person's Louvain connection.

1. Call `louvain_whoami`.
2. Report, in plain words:
   - who the connection acts for, and the workspace;
   - how many sources it can read (`readableContainers`);
   - what it may do (`grantedScopes`). It can save files only if `write` is among them.
3. If `readableContainers` is 0, explain: the person's sources have not finished connecting, or their account is not linked to their sources yet. This is not an empty workspace. They should check **Connections** in Louvain.
4. If the Louvain tools are not available at all, the connection is not set up or not signed in. Tell the person to connect Louvain in this app's connector or plugin settings and sign in. In a terminal client that lists MCP servers (for example with `/mcp`), choose the Louvain server and authenticate.
5. End with how to disconnect: **Connections → Agents → Disconnect** in Louvain ends the connection at once.
