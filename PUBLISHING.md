# Publishing

CI builds and validates everything. Listing a plugin and every OpenAI release are manual.

## Every release

1. Bump `version` in `plugins/<name>/plugin.json`. Claude Code users only receive an update
   when it changes, and OpenAI rejects a submission that reuses a version.
2. Update `extensions["com.openai"].publication.release_notes`.
3. Run `node scripts/build.mjs`, commit, and merge to `main`.
4. Download the `openai-plugin-zips` artifact from the CI run on `main` for the OpenAI upload.

## Anthropic: Claude plugin directory

**Blocked by policy until Anthropic grants written permission.** Section 4B of the
[Anthropic Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)
excludes "Software that uses AI models to generate images, video, or audio content" from both
the plugin and connector directories, unless Anthropic expressly permits it in writing. Ask an
Anthropic partner contact before submitting. Direct installs from this repository (see the
README) are not affected.

With permission, list each plugin once at <https://claude.ai/directory/manage>. You need a
paid Claude plan and a connected GitHub account with push access to the repository.

1. Submit a **Plugin bundle**: repository `layerai/agent-plugin`, plugin path
   `plugins/<name>`, branch `main`. You can't change the repository or folder later.
2. Press **Validate** in the portal. It checks README length, license, and name availability,
   which `claude plugin validate` doesn't.
3. Submit the MCP server separately as an **MCP connector** with the same URL
   (`https://mcp.app.layer.ai/mcp`) so the two listings can be paired. The connector review
   needs test credentials for a fully populated account, plus documentation, privacy policy,
   support contact, and an icon.

After the listing is live, the directory follows `main` and scans each new commit before
serving it.

## OpenAI: ChatGPT and Codex plugin directory

One-time prerequisites:

- An OpenAI organization with individual or business verification, and the Owner role or
  Apps Management Write.
- A project without EU data residency. Those projects can't submit MCP plugins.
- A reviewer test account without MFA.
- A demo video of the plugin. Put its URL in
  `extensions["com.openai"].review.demo_recording_url`.

First submission:

1. Go to <https://platform.openai.com/plugins> and upload `dist/<name>-<version>.zip`. Choose
   **With MCP**, never **Skills only**: an MCP server can't be added to a skills-only plugin
   later.
2. In the MCPs tab, enter `https://mcp.app.layer.ai/mcp`. Copy two values the portal shows:
   the domain-verification token, and ChatGPT's OAuth client metadata URL
   (`https://chatgpt.com/oauth/<callback-id>/client.json`).
3. In the `app-infra` repository, set `openai_apps_challenge_token` and
   `chatgpt_mcp_cimd_url` in `workspaces/app/variables.auto.tfvars`, merge, and
   apply `stack-gcp-app` in Terraform Cloud. Layer's Auth0 tenant only accepts CIMD clients
   that are registered in advance, and the token is served from the MCP host's bucket.
4. Back in the portal, complete domain verification, OAuth setup, and the tool scan.
5. Enter the reviewer test credentials and reviewer instructions in the dashboard. The ZIP
   must not contain them.
6. Submit, wait for the email decision, then press **Publish**.

Later releases: upload the new ZIP, submit, and press **Publish** again.

OpenAI's daily scan picks up MCP tool changes without a new ZIP. Skill or listing changes
need a new ZIP, a new review, and another Publish. The MCP origin
(`https://mcp.app.layer.ai`) can never change for an existing plugin.

Validation codes: <https://developers.openai.com/plugins/deploy/submission-errors>.
