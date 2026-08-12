# Layer — Agent Plugin

Bring [**Layer**](https://layer.ai), the platform for AI game-asset creation, into any
agent that speaks the [Agent Plugins](https://agent-plugins.org) standard.

Generate **2D images, 3D meshes, video, and audio**, browse a model-agnostic catalog
(FLUX, Imagen, Recraft, Kling, Minimax, and more), and run creative workflows — all from
your agent, wired to Layer's remote MCP server.

## What's in this plugin

| File | Purpose |
| --- | --- |
| `plugin.json` | Plugin manifest (Agent Plugins spec v1.0.0). |
| `mcp.json` | Declares the Layer MCP server (remote, Streamable HTTP). |
| `skills/using-layer/` | An onboarding skill that primes agents on Layer's concepts and tools. |

The plugin points at Layer's hosted MCP server — there is no local server to run.

## MCP server

```json
{
  "type": "streamable-http",
  "url": "https://mcp.app.layer.ai/mcp"
}
```

Authentication is **OAuth**, handled by your MCP client — there is **no API key** to
configure and no secret in this repository. On first use, your client walks you through
connecting your Layer account.

## Requirements

- An MCP client / agent that supports the Agent Plugins standard and remote
  (Streamable HTTP) MCP servers.
- A **Layer account**. A free tier is available; sign up at [layer.ai](https://layer.ai).

## Install

Install this plugin in your Agent Plugins–compatible client by pointing it at this
repository:

```
https://github.com/layerai/agent-plugin
```

Then follow your client's prompt to complete the OAuth connection to Layer. Once
connected, the Layer tools (generate, estimate, list models, run workflows, upload files,
…) become available, and the `using-layer` skill helps your agent use them well.

## Capabilities

- **Generate** images, 3D, video, and audio via Forge and multi-step workflows.
- **Estimate** the Creative Unit (CU) cost of any generation before running it.
- **Browse & recommend** models across every modality.
- **Manage** workspaces, projects, runs, and file uploads.

The server also ships **instruction tools** (`get_instructions`,
`get_forge_instructions`, `get_workflow_instructions`) that provide authoritative,
always-current usage guidance to your agent at runtime.

## Compatibility notes

This plugin ships only the **portable core** defined by Agent Plugins v1.0.0 — no
client-specific extension blocks. It works in any client that supports remote MCP servers.
Client-specific enhancements can be added later under a reverse-domain
[extension namespace](https://agent-plugins.org/plugin-authors/client-extensions) without
affecting portability.

## License

[Apache-2.0](./LICENSE) © Layer
