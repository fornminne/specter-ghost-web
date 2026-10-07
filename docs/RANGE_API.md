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
