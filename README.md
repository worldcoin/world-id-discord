<img src="./public/images/logo.png" alt="World ID Discord Bot logo" width="100" />

# Discord x Worldcoin

This project is a demonstration of serverless Discord Bot that uses [IDKit](https://github.com/worldcoin/idkit) to verify humans. Verified humans get a special role assigned which can then be used to manage special permissions.

## World ID 4 configuration

The bot verifies against a World ID 4.0 relying party (RP):

1. Register an app in the [Developer Portal](https://developer.world.org) and create a managed RP for it. Note the app id (`app_...`) and the RP id (`rp_...`).
2. Set `NEXT_PUBLIC_APP_ID` to the app id and `NEXT_PUBLIC_RP_ID` to the RP id.
3. Set `RP_SIGNING_KEY` to the RP signing key (hex). The key is generated in the Developer Portal when the RP is created and is shown only once. It is used server side only, to sign proof requests; never expose it to the client.
4. Actions are created automatically on first verification, using the action description the widget sends. There is no separate action registration step.
5. Leave `NEXT_PUBLIC_WORLD_ID_ENVIRONMENT` unset (or set it to `production`) for a production deployment. The server pins the environment it accepts proofs from: a result stamped with another environment is rejected before verification, the forwarded result is pinned to the expected environment, and the verify response's environment is checked again. Set it to `staging` only for testing with the World ID Simulator; an RP registered in both environments would otherwise accept a simulator proof on a production deployment.

`NEXT_PUBLIC_APP_ID` alone is deprecated as the verification identifier: the verify endpoint still accepts it as a fallback for migrated apps for one release (a deprecation warning is logged), but the RP context endpoint requires `NEXT_PUBLIC_RP_ID` and `RP_SIGNING_KEY`, so new deployments must set all three variables.

See `@types/env.d.ts` for the full list of environment variables.

## Local development

For local development, you also will need [ngrok](https://ngrok.com/). After you log in, you can reach the [Setup & Installation](https://dashboard.ngrok.com/get-started/setup) section. There is an instruction on how to launch and configure `ngrok`

To create your own bot:

1. Clone repo.
2. Run `npm install`.
3. Run `npm run dev`. It will launch the app at `http://localhost:3000`.
4. Launch `ngrok`.
5. Run `ngrok http http://localhost:3000`.
6. After this ngrok shows you your tunneled link in the `Forwarding` field. It will be something like `https://9469-93-87-199-13.eu.ngrok.io`.
7. Go to [Discord Developer Portal](https://discord.com/developers).
8. Press the `New Application` button, set the app name, apply policies, and press `Create`.
9. At the `INTERACTIONS ENDPOINT URL` field paste.
   `<Your NGROK tunneled url>/api/interactions` and press `Save`.
10. Create a `.env.local` file in your directory and fill it with envs from `@/types/env.d.ts`.
11. `APPLICATION ID` and `PUBLIC KEY` you can find in the `General Information` section on Discord Dev Portal.
12. To get a bot token:
    - go to the `Bot` section
    - Press `Reset Token`
    - Token will be visible after this
13. Go to OAuth2 -> General -> Redirects -> add `<localhost or NGROK tunneled address>/api/auth/callback/discord`
14. On the landing page press `Install now` button.
15. Install bot.
16. Try the `/verify` command.
