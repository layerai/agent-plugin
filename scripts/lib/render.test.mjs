import assert from "node:assert/strict";
import { test } from "node:test";
import { renderClaudeManifest, renderClaudeMcp, renderOpenAIMarketplace } from "./render.mjs";

const manifest = {
  $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  name: "demo",
  version: "1.2.3",
  description: "Demo plugin",
  author: { name: "Layer", url: "https://layer.ai" },
  license: "Apache-2.0",
  extensions: {
    "com.openai": { interface: { displayName: "Demo", category: "Creativity" } },
    "com.anthropic": { displayName: "Demo", icon: "./assets/logo.png" },
  },
};

test("Claude manifest keeps core fields, merges com.anthropic, and drops $schema and extensions", () => {
  assert.deepEqual(renderClaudeManifest(manifest), {
    name: "demo",
    version: "1.2.3",
    description: "Demo plugin",
    author: { name: "Layer", url: "https://layer.ai" },
    license: "Apache-2.0",
    displayName: "Demo",
    icon: "./assets/logo.png",
  });
});

test("streamable-http servers become Claude http servers and keep their headers", () => {
  const mcp = {
    $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
    mcpServers: { demo: { type: "streamable-http", url: "https://mcp.example.com/mcp", headers: { "X-Client": "agent" } } },
  };
  assert.deepEqual(renderClaudeMcp(mcp), {
    mcpServers: { demo: { type: "http", url: "https://mcp.example.com/mcp", headers: { "X-Client": "agent" } } },
  });
});

test("server types without a Claude mapping fail instead of rendering a broken .mcp.json", () => {
  const mcp = { mcpServers: { local: { type: "stdio", command: "./bin/server" } } };
  assert.throws(() => renderClaudeMcp(mcp), /type "stdio" has no Claude mapping/);
});

test("OpenAI marketplace entries carry the policy and category Codex requires", () => {
  const withoutCategory = { ...manifest, name: "plain", extensions: {} };
  assert.deepEqual(renderOpenAIMarketplace([manifest, withoutCategory]).plugins, [
    {
      name: "demo",
      source: { source: "local", path: "./plugins/demo" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Creativity",
    },
    {
      name: "plain",
      source: { source: "local", path: "./plugins/plain" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Other",
    },
  ]);
});
