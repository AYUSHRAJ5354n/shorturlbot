const TOKEN = '7383174818:AAGIsf0zGbBLrwZdwEswDrstYETnBSAbJN8'; // Replace with your BotFather token
const WEBHOOK = '/endpoint';
// Made by https://t.me/Ashlynn_Repository
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
// Made by https://t.me/Ashlynn_Repository
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event));
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url));
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook());
  } else {
    event.respondWith(new Response('No handler for this request', { status: 404 }));
  }
});

// Made by https://t.me/Ashlynn_Repository
async function handleWebhook(event) {
  try {
    const update = await event.request.json();
    console.log("Received update:", JSON.stringify(update, null, 2));

    if (update.message) {
      await handleMessage(update.message);
    }
    return new Response('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Made by https://t.me/Ashlynn_Repository
async function handleMessage(message) {
  console.log("Processing message:", JSON.stringify(message, null, 2));

  const chatId = message.chat.id;
  const text = message.text?.trim();

  if (!text) return;

  if (text.startsWith('/start')) {
    await sendText(
      chatId,
      `👋 Hi! Welcome to ShortURL Bot.\n\n` +
      `🔗 **Commands:**\n` +
      `1️⃣ Send any URL directly to shorten it (default API).\n` +
      `2️⃣ Use **/arshort** command to shorten a URL with an optional slug (alternate API).\n` +
      `3️⃣ Type **/help** for detailed information.\n\n` +
      `💡 Let's get started!`
    );
  } else if (text.startsWith('/help')) {
    await sendText(
      chatId,
      `📖 **Help Menu**\n\n` +
      `1️⃣ Send any URL directly to shorten it using the default API.\n` +
      `2️⃣ Use **/arshort <URL> [slug]** to shorten a URL with the https://arshorturl.pages.dev/ API:\n` +
      `   - If only the URL is provided, it generates a random short link.\n` +
      `   - If a custom slug is provided, the link will include your slug.\n\n` +
      `💡 Example:\n` +
      `/arshort https://example.com my-custom-slug\n\n` +
      `⚡️ Made By [Ashlynn Repository](https://t.me/Ashlynn_Repository).`
    );
  } else if (text.startsWith('/arshort ')) {
    const args = text.replace('/arshort ', '').trim().split(' ');
    const url = args[0];
    const slug = args[1];

    if (!isValidUrl(url)) {
      await sendText(chatId, '❌ Please provide a valid URL.');
      return;
    }

    await shortenWithAlternateAPI(chatId, url, slug);
  } else if (isValidUrl(text)) {
    await shortenWithDefaultAPI(chatId, text);
  } else {
    await sendText(chatId, '❓ Unknown command or invalid URL. Use /help for assistance.');
  }
}

// Made by https://t.me/Ashlynn_Repository
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Made by https://t.me/Ashlynn_Repository
async function shortenWithDefaultAPI(chatId, url) {
  const apiUrl = `https://url.ashlynn.workers.dev/api/short?url=${encodeURIComponent(url)}`;
// Made by https://t.me/Ashlynn_Repository
// Made by https://t.me/Ashlynn_Repository
  const tempMessage = await sendText(chatId, '🔄 Shortening URL using the default API...');
// Made by https://t.me/Ashlynn_Repository
  try {
    console.log(`Default API Request: ${apiUrl}`);
// Made by https://t.me/Ashlynn_Repository
    const response = await fetch(apiUrl);
    const data = await response.json();
// Made by https://t.me/Ashlynn_Repository
// Made by https://t.me/Ashlynn_Repository
    await deleteMessage(chatId, tempMessage.message_id);
// Made by https://t.me/Ashlynn_Repository
    if (data.shortUrl) {
      await sendText(chatId, `✅ Shortened URL: ${data.shortUrl}`);
    } else {
      await sendText(chatId, '❌ Failed to shorten the URL.');
    }
  } catch (error) {
    console.error('Error with Default API:', error);
    await sendText(chatId, '❌ An error occurred while shortening the URL.');
  }
}

async function shortenWithAlternateAPI(chatId, url, slug) {
  const body = { url };
  if (slug) body.slug = slug;

  const apiUrl = 'https://arshorturl.pages.dev/create';

// Made by https://t.me/Ashlynn_Repository
  const tempMessage = await sendText(chatId, '🔄 Shortening URL using the alternate API...');

  try {
    console.log(`Alternate API Request Body:`, JSON.stringify(body, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
// Made by https://t.me/Ashlynn_Repository
    await deleteMessage(chatId, tempMessage.message_id);

    if (data.link) {
      const responseMessage = 
        `✅ **Shortened URL**: [${data.link}](${data.link})\n` +
        `🔗 **Original URL**: [${data.url}](${data.url})\n` +
        `📅 **Date**: ${data.date}\n` +
        `🔑 **Slug**: \`${data.slug}\``;

      await sendText(chatId, responseMessage, 'Markdown');
    } else {
      await sendText(chatId, '❌ Failed to shorten the URL with the alternate API.');
    }
  } catch (error) {
    console.error('Error with Alternate API:', error);
    await sendText(chatId, '❌ An error occurred while shortening the URL.');
  }
}

// Made by https://t.me/Ashlynn_Repository
async function sendText(chatId, text, parseMode = 'Markdown') {
  const apiUrl = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode
      })
    });

    const responseData = await response.json();
    console.log('sendText API Response:', JSON.stringify(responseData, null, 2));

    return responseData.result;
  } catch (error) {
    console.error('Error in sendText:', error);
  }
}

// Made by https://t.me/Ashlynn_Repository
async function deleteMessage(chatId, messageId) {
  const apiUrl = `https://api.telegram.org/bot${TOKEN}/deleteMessage`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId
      })
    });

    const responseData = await response.json();
    console.log('deleteMessage API Response:', JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.error('Error in deleteMessage:', error);
  }
}

// Made by https://t.me/Ashlynn_Repository
async function registerWebhook(event, requestUrl) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${WEBHOOK}`;
  const apiUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl })
  });

  const data = await response.json();
  console.log('Webhook Registration Response:', data);

  return new Response(data.ok ? 'Webhook registered.' : `Failed to register webhook: ${data.description}`);
}
// Made by https://t.me/Ashlynn_Repository
async function unRegisterWebhook() {
  const apiUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: '' })
  });
// Made by https://t.me/Ashlynn_Repository
  const data = await response.json();
  console.log('Webhook Unregistration Response:', data);

  return new Response(data.ok ? 'Webhook unregistered.' : `Failed to unregister webhook: ${data.description}`);
}
// Made by https://t.me/Ashlynn_Repository
