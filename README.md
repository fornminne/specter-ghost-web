# SPECTER.GHOST

Public web interface and observability dashboard for the SPECTER ecosystem.

## Stack
React + Vite, designed for AWS Amplify Hosting.

## Local development
```bash
npm install
npm run dev
```

## Production
```bash
npm ci
npm run build
```

Amplify configuration is provided in `amplify.yml`.

## Security boundary
This repository is the public observability plane. Do not place credentials, internal addresses, SSH/MQTT administration, control-plane endpoints, private telemetry, or secrets in frontend source or Vite environment variables.

## Telemetry contract
The UI intentionally displays placeholders until a read-only health endpoint is configured. Never expose the Ghost Node control plane directly to the browser.
