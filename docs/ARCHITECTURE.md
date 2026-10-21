# Architecture

## Control plane

AWS Amplify publishes the static tree in `public/` (`amplify.yml` uses that directory and does not run Next.js). The Next.js application in `src/` is an unpublished catalog and must not be exposed until its framework release is patched.

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

Schema-backed challenges store a SHA-256 digest in `specter.json`. Browser labs still include the training marker inside the evidence a learner is meant to inspect. Published HTML must not add a `data-answer` attribute or any other machine-readable copy of the flag. The static lab form sends the submitted string to the training verifier and stores only completion in the browser.
