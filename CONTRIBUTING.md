# Contributing to SPECTER.GHOST

SPECTER.GHOST Community Edition is an open cyber-range project.

## Challenge contract

Each challenge lives under `challenges/<slug>/` and contains a `specter.json` manifest. A challenge may also contain a Dockerfile, compose fragment, fixtures, evidence, and author notes.

A manifest defines metadata, learning objectives, target type, resource limits, TTL, and a SHA-256 flag digest. Plaintext flags do not belong in public manifests.

## Safety boundary

Challenge targets must be intentionally vulnerable training systems. Do not submit infrastructure that scans, attacks, authenticates to, or persists on arbitrary external systems. Runtime targets should default to no Internet egress and must have CPU, memory, process, and lifetime limits.

## Pull requests

1. Fork the repository.
2. Add or modify one focused challenge/platform feature.
3. Run `npm run check:challenges`.
4. Run `npm run build`.
5. Describe the learning objective and isolation assumptions in the PR.
