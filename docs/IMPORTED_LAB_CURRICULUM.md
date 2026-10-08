# SPECTER.GHOST: imported lab curriculum roadmap

The public portal remains static on AWS Amplify. The archives below are reference sources, not deployable public assets. Do not copy vulnerable services into public/ or expose their default ports.

## Source inventory and licensing

- OWASP Juice Shop (`juice-shop-master.zip`): MIT license, copyright OWASP Juice Shop contributors. Reference the challenge taxonomy and develop original offline lessons for injection, access control, authentication, and insecure design. Preserve attribution if reusing code or content.
- Pentest Lab (`pentest_lab-prod.zip`): GPL-3.0, Docker Compose multi-service environment with Kali attacker service. Keep this as a separately licensed optional self-hosted integration, not copied into the MIT portal.
- Offensive Pentesting Lab (`Offensive-Pentesting-Lab-main.zip`): AD-DACL training exercises (12 labs), DNS, FTP, MySQL, RDP, SMB, SMTP, SNMP and a deliberately vulnerable e-commerce API. Verify licensing per directory before copying any assets. Never deploy the sample e-commerce API to a public endpoint; its sample Compose file includes development/debug defaults and a hard-coded JWT secret.

## Proposed guided browser challenges

| Module | Source inspiration | Browser training artifact | Skills |
|---|---|---|---|
| Shop Session | Juice Shop | Synthetic cookie and response transcript | Session handling |
| Checkout Boundary | Juice Shop / e-commerce API | Cross-customer order access trace | BOLA/IDOR |
| Query Trail | Juice Shop | Simulated SQL query and safe parameterization comparison | Injection recognition |
| Cart Integrity | E-commerce API | Price-calculation and trust-boundary worksheet | Business logic |
| Directory Rights | AD-DACL | Synthetic security descriptor / permission graph | AD ACL analysis |
| Name Resolution | DNS labs | DNS response set | DNS fundamentals |
| File Transfer Audit | FTP labs | Anonymous login configuration excerpt | Service hardening |
| Share Boundary | SMB labs | Synthetic share ACL listing | Least privilege |
| Mail Relay Audit | SMTP labs | SMTP exchange transcript | Relay policy |
| Service Exposure | Pentest Lab | Offline port inventory and topology diagram | Segmentation |

Each browser lesson must provide Learn → Investigate → Practice → Flag → Debrief. Use original synthetic artifacts and do not embed plaintext answer in the visible evidence unless the objective is explicitly basic extraction.

## Future optional container range (separate infrastructure)

Keep public site on Amplify static. A self-hosted operator may separately deploy reviewed targets on an isolated Docker network, with rootless execution, no outbound internet by default, resource limits, automatic teardown, and per-session isolation. Do not expose Docker socket or privileged containers. Do not mix GPL-licensed source into the MIT distribution without an explicit license decision.

## Current status

Planning and source inventory only. The above ten modules are not yet implemented as playable pages.
