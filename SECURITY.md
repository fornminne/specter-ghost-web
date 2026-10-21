# Security policy

SPECTER.GHOST Community Edition publishes a static training portal. That portal is not a challenge target.

## Reporting

Report vulnerabilities in the portal, this repository, or its deployment configuration through GitHub Security Advisories:

https://github.com/fornminne/specter-ghost-web/security

Do not file a public issue for an unfixed vulnerability. Include the page or file, the effect, and a minimal way to reproduce it.

## In scope

- The static site built from `public/` and served for the public portal
- Response headers, content security policy, and deployment configuration in this repository
- Accidental publication of secrets, or of active untrusted content, on the portal origin

## Out of scope

- Training challenges, simulated evidence, and training flags
- The disposable range plane, which is not part of the published portal
- Attacks against systems you are not authorized to test
- Findings that require social engineering or physical access

Give the maintainers a reasonable window to fix a confirmed portal issue before publishing details.
