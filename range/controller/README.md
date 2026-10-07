# Range Controller

A small reference control service for disposable SPECTER.GHOST challenge instances.

It defaults to **dry-run mode**, so contributors can exercise the API without giving a process access to Docker.

## Run safely

```bash
cd range/controller
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --port 8090
```

Then:

```bash
curl http://127.0.0.1:8090/health
curl -X POST http://127.0.0.1:8090/v1/instances -H 'content-type: application/json' -d '{"challenge":"ghost-protocol","ttlMinutes":15}'
```

## Real container mode

Set `SPECTER_DRY_RUN=0` only on a dedicated range host. The reference code expects a Docker daemon and the internal `specter_range` network. Do not expose the Docker socket or controller directly to the public Internet.

Production deployments should put authentication between the portal and controller, use a queue, persist instance state, issue per-instance flags, and use a stronger isolation boundary such as microVMs or a hardened Kubernetes runtime.
