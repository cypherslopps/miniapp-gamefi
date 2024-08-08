const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

bot.setWebHook(`${process.env.WEBHOOK_URL}/bot/${process.env.TELEGRAM_API_TOKEN}`);

app.post(`/bot${process.env.TELEGRAM_API_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText("/start", (msg) => {
    bot.sendMessage(msg.chat.id, `
        Dive into the multiverse \n\n
        Kill all the alien enemies disrupting time jump.
    `).then(response => {
        res.status(200).json({ message: 'Message sent successfully' });
      })
      .catch(err => {
        res.status(500).json({ error: 'Failed to send message' });
      });
});

const menuButton = {
    type: "web_app",
    text: "🕹️ Open app",
    web_app: {
        url: process.env.GAME_URL
    }
};

bot.setChatMenuButton(JSON.stringify(menuButton))
    .then(() => {
        console.log('Menu button set successfully');
    })
    .catch(err => {
        console.log("Error setting menu button-", err);
    })

app.listen(PORT, () => {
    console.log(`Mini App listening on port http://localhost:${PORT}`);
});