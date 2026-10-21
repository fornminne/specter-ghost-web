# Unpublished fixtures

Files in this directory are offline recipe-import test pages. They are not SPECTER.GHOST labs and they are not part of the public portal.

AWS Amplify publishes everything under `public/`. Keep these pages here, outside that directory. Do not copy them into `public/`, an Amplify `baseDirectory`, or any host that serves the portal.

`scripts/check-publish.mjs` fails the build if this material shows up under `public/` again.
