"use strict";

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const cron = require('node-cron');

const token = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(token);

const readAndPrint = (filename) => {
  fs.readFile(`${__dirname}/messages/${filename}`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      bot.sendMessage(CHAT_ID, data);
    }
  });
};

cron.schedule('0 8,17 * * *', () => {
  readAndPrint('scamWarning.txt');
});

cron.schedule('0 12 * * Monday', () => {
  readAndPrint('jurvetson.txt');
});

cron.schedule('0 12 * * Tuesday', () => {
  readAndPrint('ravikant.txt');
});

cron.schedule('0 12 * * Wednesday', () => {
  readAndPrint('sequoia.txt');
});

cron.schedule('0 12 * * Thursday', () => {
  readAndPrint('winklevoss.txt');
});

cron.schedule('0 12 * * Friday', () => {
  readAndPrint('zhenfund.txt');
});
