# SPECTER.GHOST

Public web interface and observability dashboard for the SPECTER ecosystem.

## Stack
React + Vite. Production deployment target: Vercel.

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm install
npm run build
```

Vercel configuration is provided in `vercel.json`. The production output directory is `dist`.

## Vercel deployment
1. Import this GitHub repository into Vercel.
2. Keep the framework preset as **Vite**.
3. Vercel will run `npm run build` and publish `dist`.
4. Add `specterghost.com` and `www.specterghost.com` under the Vercel project's Domains settings.
5. Apply the DNS records Vercel displays for the domain. DNS belongs in the DNS provider/Vercel project configuration, not in this repository.

Pushes to the production branch can deploy automatically once Git integration is connected.

## AWS Amplify
The existing `amplify.yml` is retained for compatibility. It is not used by Vercel.

## Security boundary
This repository is the public observability plane. Do not place credentials, internal addresses, SSH/MQTT administration, control-plane endpoints, private telemetry, or secrets in frontend source or Vite environment variables.

## Telemetry contract
The UI intentionally displays placeholders until a read-only health endpoint is configured. Never expose the Ghost Node control plane directly to the browser.
