export const MARKETPLACE = {
  name: "layer",
  owner: "Layer",
  displayName: "Layer",
  description: "Layer plugins for AI game-asset creation.",
};

const CORE_FIELDS = ["name", "version", "description", "author", "homepage", "repository", "license", "keywords"];

const CLAUDE_SERVER_TYPES = { "streamable-http": "http", sse: "sse" };

export function renderClaudeManifest(manifest) {
  const core = Object.fromEntries(CORE_FIELDS.filter((key) => key in manifest).map((key) => [key, manifest[key]]));
  return { ...core, ...manifest.extensions?.["com.anthropic"] };
}

export function renderClaudeMcp(mcp) {
  const mcpServers = {};
  for (const [name, server] of Object.entries(mcp.mcpServers)) {
    const type = CLAUDE_SERVER_TYPES[server.type];
    if (!type) throw new Error(`MCP server "${name}": type "${server.type}" has no Claude mapping in scripts/lib/render.mjs`);
    mcpServers[name] = { ...server, type };
  }
  return { mcpServers };
}

export function renderClaudeMarketplace(manifests) {
  return {
    name: MARKETPLACE.name,
    description: MARKETPLACE.description,
    owner: { name: MARKETPLACE.owner },
    plugins: manifests.map((m) => ({ name: m.name, source: `./plugins/${m.name}`, description: m.description })),
  };
}

export function renderOpenAIMarketplace(manifests) {
  return {
    name: MARKETPLACE.name,
    interface: { displayName: MARKETPLACE.displayName },
    plugins: manifests.map((m) => ({
      name: m.name,
      source: { source: "local", path: `./plugins/${m.name}` },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: m.extensions?.["com.openai"]?.interface?.category ?? "Other",
    })),
  };
}
