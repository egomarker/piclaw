# Amazon Bedrock

Piclaw uses Earendil Pi's native `amazon-bedrock` provider. AWS credentials stay in the AWS credential chain or service environment; Piclaw does not copy IAM secrets into `.piclaw/config.json`.

## Authentication and region

Use one of the standard credential sources:

```bash
# Named profile
export AWS_PROFILE=piclaw-bedrock

# IAM environment credentials
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
# Optional for temporary credentials
export AWS_SESSION_TOKEN=...

# Bedrock bearer token
export AWS_BEARER_TOKEN_BEDROCK=...
```

ECS task roles (`AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` or `AWS_CONTAINER_CREDENTIALS_FULL_URI`), web identity/IRSA (`AWS_WEB_IDENTITY_TOKEN_FILE`), and instance roles work through the AWS SDK credential chain.

Set `AWS_REGION` or `AWS_DEFAULT_REGION` when the profile or runtime does not supply a region. The provider defaults to `us-east-1` only when it cannot resolve another region. An inference-profile ARN takes its region from the ARN.

Piclaw's `/login` view lists Amazon Bedrock as externally authenticated. Missing Bedrock credentials do not affect other providers.

## Claude Opus 5 inference profiles

The bundled catalog exposes system-defined regional inference profiles:

- `amazon-bedrock/us.anthropic.claude-opus-5`
- `amazon-bedrock/eu.anthropic.claude-opus-5`
- `amazon-bedrock/au.anthropic.claude-opus-5`
- `amazon-bedrock/jp.anthropic.claude-opus-5`
- `amazon-bedrock/global.anthropic.claude-opus-5`

Choose a profile available to your AWS account and region. `/models` and Settings show the model label, a 1,000,000-token context window, a 128,000-token output limit, reasoning support, and native `xhigh` and `max` thinking levels.

For an application inference profile, pass its full ARN as the model ID. Application-profile ARNs often omit the underlying model name; set `AWS_BEDROCK_FORCE_CACHE=1` if you want Pi to add prompt-cache points for that profile. Claude system profiles enable prompt caching automatically.

## Dry-run and live smoke

The smoke command is offline by default:

```bash
bun run runtime/scripts/bedrock-opus5-smoke.ts
bun run runtime/scripts/bedrock-opus5-smoke.ts --model=eu.anthropic.claude-opus-5
```

It prints catalog capabilities and which credential-source categories are present. It never prints credential values.

Add `--live` to send one bounded request:

```bash
AWS_PROFILE=piclaw-bedrock AWS_REGION=us-east-1 \
  bun run runtime/scripts/bedrock-opus5-smoke.ts \
  --model=us.anthropic.claude-opus-5 --live
```

The live result reports the model, stop reason, response text, token usage, and elapsed time. CI does not run the live mode.

## Proxies

For a Bedrock-compatible proxy, use `AWS_ENDPOINT_URL_BEDROCK_RUNTIME`. `AWS_BEDROCK_SKIP_AUTH=1` supports proxies without AWS authentication, and `AWS_BEDROCK_FORCE_HTTP1=1` forces HTTP/1.1 when the proxy does not support HTTP/2.
