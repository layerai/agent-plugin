# Layer agent plugins

Plugins that bring [Layer](https://layer.ai), the platform for AI game-asset creation, into
coding and chat agents. Each plugin has one source tree. A build script generates the
Claude Code files from it, and CI packages the OpenAI upload.

| Plugin | What it does |
| --- | --- |
| [`layer`](plugins/layer) | Layer's remote MCP server plus the `using-layer` onboarding skill. |

## Install

**Claude Code**

```sh
claude plugin marketplace add layerai/agent-plugin
claude plugin install layer@layer
```

**Claude (claude.ai, Desktop, Cowork):** Customize → Plugins → Add → Add marketplace →
`layerai/agent-plugin`, then install **Layer**.

**Codex**

```sh
codex plugin marketplace add layerai/agent-plugin
codex plugin add layer@layer
```

**ChatGPT desktop:** add the marketplace with the Codex command above, restart the app, open
the Plugins Directory, choose the **Layer** marketplace, and install.

**Other Agent Plugins clients** (Cursor, GitHub Copilot, VS Code, Kiro): install the
`plugins/layer` folder of this repository as described in your client's docs.

Every client then asks you to connect your Layer account over OAuth.

## Repository layout

```text
plugins/<name>/
  plugin.json                  source: Agent Plugins manifest
                               (OpenAI listing under extensions["com.openai"],
                                Claude-only fields under extensions["com.anthropic"])
  mcp.json                     source: MCP servers
  skills/                      source: shared by every client; no Claude-specific wording
  assets/                      source: logo and other listing images
  README.md                    source: plugin readme (Anthropic's directory needs 40+ words)
  .claude-plugin/plugin.json   generated
  .mcp.json                    generated
.claude-plugin/marketplace.json    generated: Claude marketplace
.agents/plugins/marketplace.json   generated: Codex and ChatGPT marketplace
scripts/build.mjs                  checks the sources and writes the generated files
```

## Development

Requires Node 22.

```sh
node --test                    # unit tests
node scripts/build.mjs         # check sources, regenerate files; commit the result
node scripts/build.mjs --zip   # also write dist/<name>-<version>.zip for OpenAI
claude plugin validate . --strict
claude plugin validate plugins/<name> --strict
```

CI fails if a check fails, if the generated files are stale, or if Claude's validator
reports anything. Every CI run uploads the OpenAI ZIPs as the `openai-plugin-zips` artifact.

To add a plugin, create `plugins/<name>/` with the source files above, run the build, and
commit. To release, see [PUBLISHING.md](PUBLISHING.md).

## License

[Apache-2.0](LICENSE) © Layer
