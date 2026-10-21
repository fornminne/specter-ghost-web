# Range API v1

The controller is intentionally separate from the Amplify application.

## Create

`POST /v1/instances`

```json
{"challenge":"ghost-protocol","ttlMinutes":30}
```

Returns an instance ID, state, expiry timestamp, and a scoped endpoint.

## Status

`GET /v1/instances/{id}`

## Stop

`DELETE /v1/instances/{id}`

## List

`GET /v1/instances`

## Lifecycle

`starting -> running -> stopped`

The reaper destroys running instances when their TTL expires.

## Trust model

The public portal must never accept an arbitrary image name, host, command, port, or Docker option from the client. Challenge deployment is selected from a server-side allowlist generated from reviewed manifests.

The reference image runs as the unprivileged `specter` user. The default Compose file does not mount the Docker socket and does not start the controller. Dry-run mode can be called without a token. Setting `SPECTER_DRY_RUN=0` without `SPECTER_RANGE_TOKEN` makes every `/v1` route return 503. When the token is set, clients must send `Authorization: Bearer <token>`. `/health` stays unauthenticated.
