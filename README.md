# SPECTER.GHOST Community Edition

A completely open-source, self-hostable cyber range and security learning platform. The project is designed around open challenge manifests, isolated disposable targets, flag validation, learning paths, and a public portal with no mandatory login.

## What is here

- Next.js public range portal
- AWS Amplify deployment configuration
- portable `specter.json` challenge format and JSON Schema
- server-side flag validation
- six starter challenge manifests
- local Docker range reference stack
- internal-only range network and resource limits
- contributor documentation
- health endpoint at `/api/health`

## Quick start

```bash
npm install
npm run check:challenges
npm run dev
```

For the isolated local range reference:

```bash
docker compose -f range/docker-compose.yml up --build
curl http://127.0.0.1:8088/demo/
```

## Build

```bash
npm run build
npm start
```

## Hosting

The portal is deployable to AWS Amplify. The intentionally vulnerable range plane is separate and should run on isolated compute with restricted egress, resource quotas, TTLs, and automatic teardown.

## Create a challenge

Create `challenges/my-challenge/specter.json` using `schema/specter.schema.json`. Add container or static evidence assets beside it. Run `npm run check:challenges` before opening a pull request.

## License

MIT. See `LICENSE`.
