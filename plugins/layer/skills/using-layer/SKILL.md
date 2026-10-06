---
name: using-layer
description: Onboard to the Layer platform for AI game-asset creation via the Layer MCP server. Use when the user wants to generate images, 3D models, video, or audio assets, run or estimate creative workflows, browse or pick AI models, or manage Layer workspaces, projects, and files. Explains Layer's core concepts and points at the in-server instruction tools that carry the authoritative, always-current usage guidance.
---

# Using Layer

[Layer](https://layer.ai) is a model-agnostic platform for AI game-asset creation across
**2D image, 3D mesh, video, and audio** modalities. This skill primes you on the vocabulary
and the shape of the toolset. **The Layer MCP server ships its own instruction tools that are
the source of truth** — call them before relying on anything memorized here, because model
catalogs, pricing, and workflow schemas change server-side.

## First move: read the live instructions

The server exposes read-only instruction tools. Call the relevant one **before** you plan a
generation — they return current, authoritative guidance and supersede this document:

- **`get_instructions`** — general platform usage and orientation.
- **`get_forge_instructions`** — how to drive Forge (single-step generation).
- **`get_workflow_instructions`** — how to build and run multi-step creative workflows.

## Core concepts

| Term | Meaning |
| --- | --- |
| **Creative Units (CU)** | Consumption currency. Every generation costs CUs; cost varies by model and output size. Always **estimate before executing**. |
| **Modality** | Asset type: `IMAGE`, `VIDEO`, `THREE_D`, `AUDIO`, `TEXT`. |
| **Model** | An underlying AI model (FLUX, Imagen, Recraft, Kling, Minimax, …) selectable per generation. |
| **Style** | A trained or curated model configuration applied to a generation. |
| **Forge** | Single-step generation surface. |
| **Workflow** | A saved multi-step creative pipeline you can run and monitor. |
| **Workspace / Project** | Where assets and workflows live; scoped per Layer account. |

## The toolset, by intent

You do **not** need to memorize signatures — discover them from the connected server. This is
the map of what's available so you know a capability exists:

- **Orient:** `get_instructions`, `get_forge_instructions`, `get_workflow_instructions`
- **Account context:** `list_workspaces`, `get_workspace`, `list_projects`, `get_project`
- **Pick a model:** `list_base_models`, `get_base_model`
- **Generate (Forge):** `estimate_forge_price` → `execute_forge` → `get_forge_run`,
  `cancel_inference`
- **Generate (Workflows):** `list_workflows`, `import_workflow`, `get_blueprint_system_config`,
  `estimate_workflow_price` → `execute_workflow` → `get_workflow_run`, `cancel_workflow_run`
- **Video timeline:** `estimate_video_timeline_price` → `render_video_timeline`
- **Reference sets and training:** `list_reference_sets`, `get_reference_set`,
  `create_reference_set`, `estimate_training_price` → `start_training` → `get_training_status`,
  `list_training_runs`, `get_trained_model`, `cancel_training_run`
- **Image utilities:** `compose_image`, `render_text`, `split_sprite_sheet`, `pack_sprite_sheet`
- **Scoring:** `list_output_scoring_rules`, `score_files`, `get_file_scores`
- **Inspect a run:** `get_generation_run`
- **Files:** `request_file_upload_url`, `upload_file`

## Working rules

1. **Estimate, then execute.** Call the matching `estimate_*` tool and surface the CU cost to the
   user before running anything that spends CUs.
2. **Confirm the target.** Resolve the workspace/project (`list_workspaces`, `list_projects`)
   before generating, so assets land where the user expects.
3. **Executions are asynchronous.** After `execute_*` / `render_*`, poll the matching
   `get_*_run` tool for status and outputs rather than assuming immediate completion.
4. **Let the tools teach you.** Prefer the instruction tools and each tool's own schema over
   assumptions in this file.

## Access

Connecting requires a **Layer account** (a free tier is available). The client handles the
OAuth connection to Layer; there is no API key to configure. If a tool returns an
authentication error, complete the OAuth connection in your client's MCP settings.
