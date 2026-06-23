# E2E Test Environment Setup

## Prerequisites

1. A running PiClaw instance (local or microvm)
2. The instance's internal secret (for E2E auth bootstrap)
3. (Optional) An OpenCode API key — free-tier models work without one

## Quick Start

### 1. Configure the test instance

```bash
cd tests/e2e

# No API key needed for free-tier models:
bun run setup/configure-test-instance.ts

# Or with a key for paid models:
OPENCODE_API_KEY=oc-your-key bun run setup/configure-test-instance.ts
```

This will:
- Write provider credentials to `~/.pi/agent/auth.json` using the current Pi credential shape (`type: "api_key"`, `key`, and provider `env`)
- Configure the active model in `~/.pi/agent/models.json` with an explicit custom-provider `models` array
- Validate API connectivity (model list)
- Run a test completion against the configured `OPENCODE_MODEL`

### 2. Validate the full test environment

```bash
PICLAW_E2E_URL=http://localhost:3000 \
PICLAW_INTERNAL_SECRET=your-secret \
bun run setup/validate-test-config.ts
```

This checks:
- Instance reachability
- E2E auth bootstrap endpoint
- Model availability
- Agent can complete a turn

### 3. Run the tests

```bash
PICLAW_E2E_URL=http://localhost:3000 \
PICLAW_INTERNAL_SECRET=your-secret \
bun run test
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENCODE_API_KEY` | No | — | OpenCode API key (free models work without) |
| `OPENCODE_BASE_URL` | No | `https://opencode.ai/zen/v1` | OpenCode ZEN API endpoint |
| `OPENCODE_MODEL` | No | `minimax-m2.5-free` | Model to use for tests |
| `PICLAW_E2E_URL` | Yes (tests) | `http://localhost:3000` | PiClaw instance URL |
| `PICLAW_INTERNAL_SECRET` | Yes (tests) | — | Instance internal secret for auth |
| `PICLAW_PI_AGENT_DIR` | No | `~/.pi/agent` | Override where setup scripts write `auth.json`, `models.json`, and `settings.json` |

## Provider Options

### Option A: OpenCode ZEN (no external API key, anywhere)

```bash
bun run setup/configure-test-instance.ts
```

- No external API key required for free-tier models
- Writes a placeholder `auth.json` credential so Pi's model registry marks the custom provider available
- Defines `opencode-zen` in `models.json` with `baseUrl`, `api: "openai-completions"`, and a `models` array containing `OPENCODE_MODEL`
- Works anywhere (local, CI, etc.)
- Model: `minimax-m2.5-free` — fast, 38 tokens for hello
- Free models return both `reasoning` and `content` fields

### Option B: GitHub Models (zero-config in CI)

```bash
# In GitHub Actions — GITHUB_TOKEN is automatic:
bun run setup/configure-github-models.ts

# Locally with a PAT:
GITHUB_TOKEN=ghp_... bun run setup/configure-github-models.ts
```

- Uses `$GITHUB_TOKEN` (auto-injected in Actions runners) stored in `auth.json`
- Defines `github-models` in `models.json` with `authHeader: true`; request auth comes from `auth.json`, not a duplicate literal token in `models.json`
- Model: `gpt-4o-mini` — fast, predictable, 19 tokens for hello
- **Preferred for CI** — reliable, no external dependency
- Requires `permissions: { models: read }` in workflow

### Recommendation

| Environment | Use |
|-------------|-----|
| GitHub Actions CI | **GitHub Models** (`gpt-4o-mini`, zero-config) |
| Local development | **OpenCode ZEN** (`minimax-m2.5-free`, no credentials) |
| Microvm test | Either (both work) |

## CI Integration

For CI/CD pipelines using GitHub Models (preferred — no secrets needed):

```yaml
permissions:
  models: read

steps:
  - name: Configure E2E LLM
    run: bun run tests/e2e/setup/configure-github-models.ts
    # GITHUB_TOKEN is automatic

  - name: Run E2E tests
    run: bun run test
    working-directory: tests/e2e
    env:
      PICLAW_E2E_URL: http://localhost:3000
      PICLAW_INTERNAL_SECRET: ${{ secrets.PICLAW_INTERNAL_SECRET }}
```

Or using OpenCode (no external secrets at all):

```yaml
steps:
  - name: Configure E2E LLM
    run: bun run tests/e2e/setup/configure-test-instance.ts
    # No env vars needed
```

## Microvm Target

For running against the microvm-ui-test instance:

```bash
PICLAW_E2E_URL=http://microvm-test:3000 \
PICLAW_INTERNAL_SECRET=$(cat /path/to/secret) \
bun run test
```

See the `microvm-ui-test` skill for provisioning a test instance.
