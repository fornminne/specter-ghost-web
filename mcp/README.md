# SPECTER-GHOST read-only MCP (WRAITH)

This is a **development branch**, not a deployed service. It runs on WRAITH's loopback interface and requires a bearer secret. It does not expose shell execution, local files, firmware writes, or deployment commands.

## Install and local validation

On WRAITH, with Node 20+:

```sh
cd mcp
npm install
MCP_BEARER_TOKEN="$(openssl rand -hex 32)" npm test
```

To run persistently, create a dedicated unprivileged `spectermcp` service account, deploy the repository under `/opt/specter-ghost-web`, and install the systemd unit in `deploy/`. Put `MCP_BEARER_TOKEN=<64 hex characters>` and `MCP_PUBLIC_ORIGIN=https://specterghost.com` in `/etc/specter-ghost-mcp.env`, owned by root and mode 0600. Use a stable secret, not the test secret. Run `npm ci --omit=dev` after committing a lockfile generated with `npm install`.

Merge only the MCP route from `deploy/Caddyfile.example` into the existing Caddyfile. Check `caddy validate --config /etc/caddy/Caddyfile` before reloading. Do not overwrite the website's current routing. Configure DNS and TLS for the domain, or use a dedicated `mcp.specterghost.com` hostname if the apex is hosted elsewhere.

## Verification

```sh
curl -i https://specterghost.com/mcp
# 401 expected
curl -fsS http://127.0.0.1:8787/healthz
# {"ok":true}
```

## Authentication limitation

This build supports a fixed bearer secret for explicitly compatible MCP clients only. **It does not implement OAuth authorization-server metadata, protected-resource metadata, dynamic client registration, or an interactive OAuth authorization flow.** Therefore it is not ready for ChatGPT Custom Connector OAuth onboarding. Do not paste the bearer secret into a client that expects OAuth. An OAuth 2.1/OIDC gateway with audience, scope, issuer, expiry, and token verification is required before that integration.

## Threat boundaries

The GitHub calls are pinned to a fixed public repository and constrained tag format. No arbitrary URLs, paths, or commands are accepted. No local project reports are published. Add evidence-reading only after an explicit data-classification and authorization review.
