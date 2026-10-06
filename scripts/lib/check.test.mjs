import assert from "node:assert/strict";
import { test } from "node:test";
import { checkPlugin, parseSkill } from "./check.mjs";

const positiveCase = (n) => ({
  description: `positive ${n}`,
  prompt: `prompt ${n}`,
  tools_triggered: "list_models",
  expected_behavior: "Lists models",
});
const negativeCase = (n) => ({ description: `negative ${n}`, prompt: `prompt ${n}` });

const validPlugin = () => ({
  dirName: "demo",
  manifest: {
    name: "demo",
    version: "1.0.0",
    description: "Demo plugin",
    extensions: {
      "com.openai": {
        interface: {
          displayName: "Demo",
          shortDescription: "Demo assets",
          longDescription: "A longer description of the demo plugin.",
          developerName: "Layer",
          category: "Creativity",
          websiteURL: "https://layer.ai",
          supportURL: "https://help.layer.ai/en/",
          privacyPolicyURL: "https://layer.ai/privacy-policy",
          termsOfServiceURL: "https://layer.ai/terms-of-service",
          defaultPrompt: ["Make a sword icon"],
          logo: "./assets/logo.png",
        },
        onboardingSkill: "./skills/using-demo/SKILL.md",
        review: {
          test_cases: {
            positive: [1, 2, 3, 4, 5].map(positiveCase),
            negative: [1, 2, 3].map(negativeCase),
          },
        },
      },
      "com.anthropic": { icon: "./assets/logo.png" },
    },
  },
  skills: [{ dir: "using-demo", name: "using-demo", description: "Use when making demo assets.", body: "# Using demo" }],
  fileExists: () => true,
});

const openai = (plugin) => plugin.manifest.extensions["com.openai"];

test("a complete plugin passes", () => {
  assert.deepEqual(checkPlugin(validPlugin()), []);
});

const rejections = [
  ["a name with a period", (p) => (p.dirName = p.manifest.name = "demo.v2"), /kebab-case/],
  ["a directory that differs from the manifest name", (p) => (p.dirName = "other"), /must match manifest name/],
  ["a non-semver version", (p) => (p.manifest.version = "1.0"), /semver/],
  ["a displayName over 30 characters", (p) => (openai(p).interface.displayName = "x".repeat(31)), /displayName/],
  ["a multi-line shortDescription", (p) => (openai(p).interface.shortDescription = "two\nlines"), /shortDescription/],
  ["a missing longDescription", (p) => delete openai(p).interface.longDescription, /longDescription/],
  ["an unknown category", (p) => (openai(p).interface.category = "Games"), /category "Games"/],
  ["an http privacy policy URL", (p) => (openai(p).interface.privacyPolicyURL = "http://layer.ai/privacy"), /privacyPolicyURL/],
  ["four default prompts", (p) => (openai(p).interface.defaultPrompt = ["a", "b", "c", "d"]), /defaultPrompt/],
  ["a missing logo", (p) => delete openai(p).interface.logo, /logo is required/],
  ["a logo file that does not exist", (p) => (p.fileExists = (rel) => rel !== "./assets/logo.png"), /interface.logo ".\/assets\/logo.png" must be/],
  ["an icon path escaping the plugin", (p) => (p.manifest.extensions["com.anthropic"].icon = "./../logo.png"), /com.anthropic.icon/],
  ["an apps reference", (p) => (openai(p).apps = "./.app.json"), /com.openai.apps makes/],
  ["four positive test cases", (p) => openai(p).review.test_cases.positive.pop(), /exactly 5 positive and 3 negative/],
  ["a positive case without tools_triggered", (p) => delete openai(p).review.test_cases.positive[0].tools_triggered, /needs description, prompt, tools_triggered/],
  ["a skill whose name differs from its directory", (p) => (p.skills[0].name = "other"), /must match its directory/],
  ["a qualified skill name over 64 characters", (p) => Object.assign(p.skills[0], { dir: "s".repeat(60), name: "s".repeat(60) }), /exceeds 64 characters/],
  ["a skill that mentions Claude", (p) => (p.skills[0].body = "Ask Claude to pick a model."), /mentions "Claude"/],
];

for (const [label, mutate, expected] of rejections) {
  test(`rejects ${label}`, () => {
    const plugin = validPlugin();
    mutate(plugin);
    assert.match(checkPlugin(plugin).join("\n"), expected);
  });
}

test("parseSkill reads single-line frontmatter and the body", () => {
  assert.deepEqual(parseSkill("---\nname: using-demo\ndescription: Use when making demo assets.\n---\n\n# Using demo\n"), {
    name: "using-demo",
    description: "Use when making demo assets.",
    body: "\n# Using demo\n",
  });
});
