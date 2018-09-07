// get the telegram chat ids of everyone in avengers and use them to populate the chat database.
const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");
const db = "http://localhost:8050/api";
// replace the value below with the Telegram token you receive from @BotFather
const token = require('./.secret.js').internalBot;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const testChatid =-1001257002113;
const avengersChatid = -1001250878096;
bot.sendMessage(avengersChatid, 'I need direct messages from everyone before we can move on to stage 2 ;^)');
bot.on('message', (msg) => {
  const name = msg.from.first_name + ' ' + msg.from.last_name;
  const chatid = msg.from.id;
  axios.post(db + '/chats', {
      Name: name,
      id: chatid
  })
  .then(function(response) {
      console.log("success");
      bot.sendMessage(avengersChatid, 'thank you '+ name + ". You will not regret this :^)");
  })
  .catch(function(error) {
  	  console.log("error");
      console.log(error.message);
      return error;
  });
});
