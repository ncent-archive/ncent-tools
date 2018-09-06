"use strict";
// add @nCentSpamBot to a chat group and it will delete all forwarded messages,
// except for messages sent by admins of that group

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const blacklistedUsernames = csvToArray(process.env.BLACKLISTED_USERNAMES);
const blacklistedWords = csvToArray(process.env.BLACKLISTED_WORDS);
const bot = new TelegramBot(token, {polling: true});


function csvToArray(csvString) {
	if (!csvString || csvString === "") {
		return [];
	}
	const arr = csvString.split(',');
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].toLowerCase();
	}
	return (arr);
}

function forwardedMessageRejection(author) {
	return `Sorry @${author}, forwarded messages are not allowed here, your message has been deleted.🤖`
}

function badUsernameRejection(author) {
	return `Sorry @${author}, your message has been rejected.`
}

function badWordRejection(author) {
  return `Sorry @${author}, your message includes blacklisted words`
}

function deleteMessageAndRespond(chatId, messageId, response) {
	bot.deleteMessage(chatId, messageId);
	bot.sendMessage(chatId, response);
}

function forwardMessageCheck(msg) {
  return (msg.forward_from || msg.forward_from_chat || msg.forward_date);
}

function blacklistWordsCheck(msg) {
	const lowercaseWord = msg.toLowerCase();
	for (let i = 0; i < blacklistedWords.length; i++) {
		if (lowercaseWord.includes(blacklistedWords[i])) {
			return true;
		}
	}
	return false;
}

function blacklistUsernameCheck(username) {
	const lowercaseName = username.toLowerCase();
	for (let i = 0; i < blacklistedUsernames.length; i++) {
		if (lowercaseName.includes(blacklistedUsernames[i])) {
			return true;
		}
	}
	return false;
}

async function isAdmin(chatId, authorId) {
  const sender = await bot.getChatMember(chatId, authorId);
  const status = sender.status
  return (status === 'creator' || status === 'administrator');
}

async function deleteRestrictedMessages(msg) {
  const author = msg.from;
  const username = author.username;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  isAdmin(chatId, author.id).then((res)=>{
    if (res === true) { return; }
    if (forwardMessageCheck(msg)) {
      deleteMessageAndRespond(chatId, messageId, forwardedMessageRejection(username));
    } else if (blacklistWordsCheck(msg.text)) {
			deleteMessageAndRespond(chatId, messageId, badWordRejection(username));
    } else if (blacklistUsernameCheck(username)) {
      deleteMessageAndRespond(chatId, messageId, badUsernameRejection(username));
    }
  });
}

bot.on('message', deleteRestrictedMessages);
