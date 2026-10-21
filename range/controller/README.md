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

Set `SPECTER_DRY_RUN=0` only on a dedicated range host, and set `SPECTER_RANGE_TOKEN` at the same time. Without that token, `/v1` returns 503. With the token set, send `Authorization: Bearer <token>` on every `/v1` request. The container image drops to the `specter` user. Do not mount the Docker socket onto the portal or onto this controller when it is reachable from the public site.

Production deployments should put authentication between the portal and controller, use a queue, persist instance state, issue per-instance flags, and use a stronger isolation boundary such as microVMs or a hardened Kubernetes runtime.
