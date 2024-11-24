## ShortURL Cloudflare Bot Code

This repository contains code to deploy a ShortURL bot on Cloudflare Workers using `worker.js`

# Prerequisites
- A Telegram bot token from @BotFather
- A Cloudflare account with Workers enabled

1 Configuration

Set up your Telegram bot:
- Obtain your bot token from @BotFather.
- Set the TOKEN variable in `worker.js` with your bot's token.

# Deployment Steps

- Go to the Cloudflare dashboard, navigate to Workers, and create a new Worker.
- Copy the code from worker.js and paste it into the Worker editor.

# Deploy the Worker:

 Save and deploy the Worker. Cloudflare will assign a URL to your Worker.

# Webhook Registration:

 - Access `/registerWebhook` endpoint to register your Telegram webhook.
 - Use `/unRegisterWebhook` to remove the webhook if needed.

# Endpoints

- `/endpoint`: Main webhook endpoint for handling Telegram updates.
- `/registerWebhook`: Registers the bot's webhook with Telegram.
- `/unRegisterWebhook`: Unregisters the bot's webhook.

## Credits
Made by [Ashlynn Repository](https://t.me/Ashlynn_Repository)

If you find this project useful, please consider giving it a ⭐ on GitHub! Your support helps improve and maintain this repository. Forking the repo is also encouraged – feel free to customize and enhance the code to fit your own needs.

