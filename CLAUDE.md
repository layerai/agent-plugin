# CLAUDE.md

- Sources per plugin: `plugins/<name>/{plugin.json, mcp.json, skills/, assets/, README.md}`.
- Never edit generated files: `.claude-plugin/`, `.agents/`, `plugins/*/.claude-plugin/`,
  `plugins/*/.mcp.json`. Change the sources, then run `node scripts/build.mjs`.
- Verify: `node --test`, `node scripts/build.mjs --zip`, `claude plugin validate . --strict`,
  `claude plugin validate plugins/<name> --strict`.
- Skills ship to both Claude and OpenAI, so keep their wording client-neutral.
- Releasing: see PUBLISHING.md.
