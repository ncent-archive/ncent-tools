const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");
const db = "http://localhost:8061/TelegramUsers";
// replace the value below with the Telegram token you receive from @BotFather
const token = '<token for bot>';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

function newMember(msg) {

}
