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

// Prevent scam message is sent each day at 0800 and 1700 SERVER TIME
cron.schedule('0 8,17 * * *', () => {
  readAndPrint('scamWarning.txt');
});

// Clever1 message is sent each Sunday at 500 SERVER TIME
cron.schedule('0 5 * * Sunday', () => {
  readAndPrint('clever1.txt');
});

// Clever2 message is sent each Sunday at 1200 SERVER TIME
cron.schedule('0 12 * * Sunday', () => {
  readAndPrint('clever2.txt');
});

// Clever3 message is sent each Monday at 500 SERVER TIME
cron.schedule('0 5 * * Monday', () => {
  readAndPrint('clever3.txt');
});

// Jurvetson message is sent each Monday at 1200 SERVER TIME
cron.schedule('0 12 * * Monday', () => {
  readAndPrint('jurvetson.txt');
});

// Clever4 message is sent each Tuesday at 500 SERVER TIME
cron.schedule('0 5 * * Tuesday', () => {
  readAndPrint('clever4.txt');
});

// Ravikant message is sent each Tuesday at 1200 SERVER TIME
cron.schedule('0 12 * * Tuesday', () => {
  readAndPrint('ravikant.txt');
});

// Clever5 message is sent each Wednesday at 500 SERVER TIME
cron.schedule('0 5 * * Wednesday', () => {
  readAndPrint('clever5.txt');
});

// Sequoia message is sent each Wednesday at 1200 SERVER TIME
cron.schedule('0 12 * * Wednesday', () => {
  readAndPrint('sequoia.txt');
});

// Clever6 message is sent each Thursday at 500 SERVER TIME
cron.schedule('0 5 * * Thursday', () => {
  readAndPrint('clever6.txt');
});

// Winklevoss message is sent each Thursday at 1200 SERVER TIME
cron.schedule('0 12 * * Thursday', () => {
  readAndPrint('winklevoss.txt');
});

// Clever7 message is sent each Friday at 500 SERVER TIME
cron.schedule('0 5 * * Friday', () => {
  readAndPrint('clever7.txt');
});

// Zhenfund message is sent each Friday at 1200 SERVER TIME
cron.schedule('0 12 * * Friday', () => {
  readAndPrint('zhenfund.txt');
});

// Clever8 message is sent each Saturday at 500 SERVER TIME
cron.schedule('0 5 * * Saturday', () => {
  readAndPrint('clever8.txt');
});

// Sequoia message is sent each Saturday at 1200 SERVER TIME
cron.schedule('0 12 * * Saturday', () => {
  readAndPrint('sequoia.txt');
});
