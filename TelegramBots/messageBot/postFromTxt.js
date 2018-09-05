"use strict";
// run node wordCentBot.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
// token for nCentBot
const token = require('./.secret.js').messageBot;
const testChatid =-1001257002113;
const CHAT_ID = testChatid;
const bot = new TelegramBot(token);
fs.readFile(__dirname + "/"+process.argv[2], function(err, data) {
  	if (err) {
		console.log(err);
		return;
	}
	bot.sendMessage(CHAT_ID, data);
});
