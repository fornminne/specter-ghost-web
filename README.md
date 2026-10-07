# SPECTER.GHOST v2

Open-access cyber range and security training platform. No login or account required.

## Run
```bash
npm install
npm run dev
```

## Deploy
Import this repository into AWS Amplify Hosting. No environment variables or database are required for the public training UI.

## Security boundary
Challenges are intentionally simulated in the public web app. Real vulnerable targets must run in isolated disposable infrastructure and be exposed only through a dedicated lab gateway. Never make the AWS Amplify Hosting application itself intentionally vulnerable.
