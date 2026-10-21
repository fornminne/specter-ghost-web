# Security policy

SPECTER.GHOST Community Edition is a training portal. The public site is the catalog, not a target.

## Reporting

Report vulnerabilities through [GitHub security advisories](https://github.com/fornminne/specter-ghost-web/security) for this repository. Please include the affected path, the impact, and a minimal reproduction that stays on SPECTER.GHOST training assets.

Do not scan or attack systems you are not authorized to test. The hosted portal, its verifier, and third-party sites are out of scope for training.

## What is in scope

- The static portal published from `public/`
- Flag verification and the range controller reference in this repository
- Challenge manifests and the pages generated or checked in for labs

Training flags are exercise markers. A learner is expected to recover them from the supplied evidence. Machine-readable answer attributes do not belong in published HTML.

## Deployment boundary

Amplify publishes the static tree in `public/` (`amplify.yml` sets `baseDirectory: public`). It does not run `next build`. The Next.js app in `src/` is unpublished. Do not point a public host at `next start`, and do not switch Amplify to a Next build, until that app is upgraded off the current Next.js 14 release and `npm audit` is clean.

The range controller defaults to dry-run and is not part of the Compose file. Do not mount a Docker socket on the portal or on any process reachable from it. Live container mode requires `SPECTER_RANGE_TOKEN` and refuses `/v1` traffic when that token is missing.

## Known dependency note

`next@14.2.33` has upstream security advisories. Those advisories apply if this repository is served with Next.js. They are not, by themselves, a finding against the static Amplify site.
