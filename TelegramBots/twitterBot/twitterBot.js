"use strict";

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const cron = require('node-cron');
const Twitter = require('twitter');

const token = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const CONS_KEY = process.env.CONS_KEY;
const CONS_SECRET = process.env.CONS_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const bot = new TelegramBot(token);

const client = new Twitter({
  consumer_key: CONS_KEY,
  consumer_secret: CONS_SECRET,
  access_token_key: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET
});

// Extended tweet_mode to avoid message truncation
// since_id to only retrieve new messages and record last message sent to chat
let params = {screen_name: 'KK_ncnt', since_id: 1, tweet_mode: 'extended'};

const retrieveLatestTweet = (callback) => {
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      if (tweets[0]) {
        callback(tweets[0]);
      } else {
        console.log(`tweets[0] undefined at ${Date.now()}`);
        console.log(tweets);
      }
    } else {
      console.log(error);
    }
  });
};

cron.schedule('0 8,17 * * *', () => {
  retrieveLatestTweet((tweet) => {
    const latestTweetId = tweet.id;
    const latestTweetIdStr = tweet.id_str;
    const latestTweetText = tweet.full_text;
    if (latestTweetId !== params.since_id) {
      params.since_id = latestTweetId;
      const fullMessage = `${tweet.full_text}\nhttps://twitter.com/${params.screen_name}/status/${latestTweetIdStr}`
      bot.sendMessage(CHAT_ID, fullMessage, {disable_web_page_preview: true});
    }
  });
});
