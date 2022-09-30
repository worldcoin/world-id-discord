<img src="logo.png" alt="World ID Discord Bot logo" width="100" />

# World ID Discord Bot

This project is a demonstration of serverless Discord Bot that uses [World ID](#-about-world-id) to verify humans. Verified humans get a special role assigned which can then be used to manage special permissions.

Project is built using [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) IaC and [projen](https://github.com/projen/projen#readme).

## ⚙️ Running frontend in development (landing & config page)

```sh
   npx projen
   cd src/landing-page
   npm run src/dev
```

## 🚀 Using the bot

> **Note** We are working on publishing this bot on Discord so it can be installed in your own server with one-click. **Coming soon!**
> You can deploy your own version in the meantime.

## 🏆 Deploying your own bot

### 1. Create an action on Developer Portal

1. Head over to Worldcoin's [Developer Portal](https://developer.worldcoin.org) and create an action.
2. You'll need to create an action that runs on **Cloud**. Select **Production** mode if you want to run it with actual human verification, otherwise use **Staging** to test with the simulator.

### 2. Bootstrap your Discord Bot App

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and create new application.
   - Take note of the application ID (e.g. `984381699360161823`)
2. Create a new Bot for the application and make sure your **save the Bot Token**!
   - Take note of the Bot public key (e.g. `aa4f7f5e1affd2c054ca07a2733007d44775826c821f6c0ddc3d3826a54eeb1a`)
3. Go to the OAuth2 page and create a client secret.
   - Take note of the OAuth2 client secret (e.g. `4CqPc0000UwqP1234Wd7r81kUm6k3LA`)

### 3. Deploy to AWS

1. Make sure you have [Node.js](https://nodejs.org) installed. Version **16.14.0** recommended (or above).

1. Install project dependencies:

   ```sh
   npm install
   npx projen
   ```

1. Ensure you have latest version of [AWS CLI](https://aws.amazon.com/cli/) and configure your AWS CLI (we recommend you create a profile specific for your AWS account). If you create a named profile instead of using `default`, be sure to use that profile name in all `aws` or `cdk` commands below:

   ```sh
   brew update && brew upgrade awscli
   aws configure # or aws sso login (if applicable)
   ```

1. If this is your first deployment using [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html), you'll need to bootstrap it in your AWS account:

   ```sh
   cdk bootstrap
   ```

1. Create relevant secrets.

   a) Create secret with name `WorldIdDiscordBotToken` and the bot token as the value:

   ```sh
   aws secretsmanager create-secret --name WorldIdDiscordBotToken --description "Bot token for World ID Discord Bot" --secret-string <your 60+ chars long bot token saved during bot creation> --profile default
   ```

   b) Create secret with name `WorldIdDiscordBotClientSecret` and the OAuth2 client secret as the value:

   ```sh
   aws secretsmanager create-secret --name WorldIdDiscordBotClientSecret --description "Client secret for World ID Discord Bot" --secret-string <your bot client secret> --profile default
   ```

1. _[Optional]_. Set CDK Context values at `project.ts` (or set them below using the CLI command)

1. Install project dependencies:

   ```sh
   npx projen
   ```

1. Run CDK deployment (**set the proper deployment values if you didn't set them in `project.ts`**):

   ```sh
   npx cdk deploy
     --context bot_app_id=12345678 \
     --context bot_public_key=fdced6398cf4c6c96700069237df19ed393083f \
     --context roles_for_verified_user="Validated Human,World ID" \
     --context signal="<none>" \
     --context action_id="wid_XC36mm99KFeXh2p9P" \
     --profile=default
   ```

1. Grab `WorldID-Discord-Bot.discordbotapiEndpoint<some hash>` output (it should be an url similar to `https://3dhsrvte6f.execute-api.us-east-1.amazonaws.com/prod/`) and save it into <b>Interactions endpoint URL</b> on your Bot settings at Discord Developers Portal.

   > If you are seeing `interactions_endpoint_url: The specified interactions endpoint url could not be verified` error during this step then make sure that you provided proper `bot_app_id` and `bot_public_key` CDK context values (carefully review steps above).

1. Grab `OAuth2CallbackUrl` output (similar to `https://2rrg16x6qh.execute-api.us-east-1.amazonaws.com/prod/oauth2callback`) and save it into `Redirects` field on the bot `OAuth2` General settings.

1. Head over to the **URL Generator** tab of **OAuth2** and create a link with the following scopes:

   - Scopes: `guilds`, `bot`, `applications.commands`
   - Redirect URL: Select the URL you added in the previous step.
   - Bot permissions: `Manage Roles`, `Send Messages`, `Embed Links`, `Attach Files`.

1. Visit the generated URL to install the bot in your server.

<!-- WORLD-ID-SHARED-README-TAG:START - Do not remove or modify this section directly -->
<!-- The contents of this file are inserted to all World ID repositories to provide general context on World ID. -->

## <img align="left" width="28" height="28" src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-orb.png" alt="" style="margin-right: 0;" /> About World ID

World ID is a protocol that lets you **prove a human is doing an action only once without revealing any personal data**. Stop bots, stop abuse.

World ID uses a device called the [Orb](https://worldcoin.org/how-the-launch-works) which takes a picture of a person's iris to verify they are a unique and alive human. The protocol uses [Zero-knowledge proofs](https://id.worldcoin.org/zkp) so no traceable information is ever public.

World ID is meant for on-chain web3 apps, traditional cloud applications, and even IRL verifications.

<img src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-diagram.png" alt="Diagram of how World ID works."  />

### Getting started with World ID

Regardless of how you landed here, the easiest way to get started with World ID is through the the [Dev Portal](https://developer.worldcoin.org).

<a href="https://developer.worldcoin.org">
<p align="center">
  <img src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-get-started.png" alt="Get started" height="50" />
</p>
</a>

### World ID Demos

Want to see World ID in action? We have a bunch of [Examples](https://id.worldcoin.org/examples).

<a href="https://id.worldcoin.org/examples">
<p align="center">
  <img src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-examples.png" alt="Click here to see examples" height="150" />
</p>
</a>

## 📄 Documentation

We have comprehensive docs for World ID at https://id.worldcoin.org/docs.

<a href="https://id.worldcoin.org/docs">
<p align="center">
  <img src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-docs.png" alt="Visit documentation" height="50" />
</p>
</a>

## 🗣 Feedback

**World ID is in Beta, help us improve!** Please share feedback on your experience. You can find us on [Discord](https://discord.gg/worldcoin), look for the [#world-id](https://discord.com/channels/956750052771127337/968523914638688306) channel. You can also open an issue or a PR directly on this repo.

<a href="https://discord.gg/worldcoin">
<p align="center">
  <img src="https://raw.githubusercontent.com/worldcoin/world-id-docs/main/public/images/shared-readme/readme-discord.png" alt="Join Discord" height="50" />
</p>
</a>

<!-- WORLD-ID-SHARED-README-TAG:END -->
