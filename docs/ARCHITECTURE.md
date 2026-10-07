# Architecture

## Control plane

The Next.js application is the public SPECTER.GHOST Community Edition portal. AWS Amplify can host this layer. It serves the catalog, learning paths, challenge pages, health endpoints, and flag validation.

## Range plane

Real challenge workloads are separate from the public web application. The local reference implementation uses Docker Compose. A production operator can replace this with Kubernetes, Firecracker, ECS, Nomad, or another isolation layer.

The range plane contract is intentionally small:

- create a challenge instance from a known manifest
- return a scoped connection endpoint
- enforce resource and network policy
- expire the instance at its TTL
- destroy all per-instance state on teardown

## Network boundary

Challenge containers should use an internal range network and have no unrestricted Internet egress. Never place deliberately vulnerable services in the Amplify application.

## Open challenge format

`specter.json` is the portable challenge definition. The schema is published at `schema/specter.schema.json`.

## Flags

The portal validates submitted flags against SHA-256 digests. This keeps plaintext answers out of browser bundles. Public hashes are not intended to be a high-security secret store; production operators may replace the validator with per-instance flags.
