"use strict";
// run node wordCentBot.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = require('./.secret.js').sticketCentBot;

// const avengersChatid = -1001250878096;
// const testChatid =-1001257002113;
const ADMIN_USERNAME = "Cryptopit";
const POINTS_PER_STICKER = 16;
// const WARNING_PERIOD = 120; // seconds
// change to suit file system.
const DATA_FILENAME = __dirname + "/stickerGameData";

// global state variables
var gameChatID = 0;			// telegram chat id of the chat room where the game is
var players = {};			// dictionary of players by telegram id
var listening = false;

const bot = new TelegramBot(token, {polling: true});

//turn on admin gameplay commands
bot.on('message', adminCommands);

// game state object
function gameData() {
	this.gameChatID = gameChatID;
	this.players = players;
}

// called whenever game state changes so that changes can be recovered if the game crashes.
function saveData() {
	let data = new gameData();
	fs.writeFile(DATA_FILENAME, JSON.stringify(data), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

// load game state from gameData object
function loadData(data){
	gameChatID = data.gameChatID;
	players = data.players;
}

// restart the game from data saved in DATA_FILENAME.
function restartGame() {
	fs.readFile(DATA_FILENAME, function(err, data) {
	  	if (err) {
			console.log(err);
			return;
		}
		var newData = JSON.parse(data);
		loadData(newData);
		if(!listening){
			bot.on('message',listenForStickers);
			bot.on('message',newChatMembers);
			listening = true;
		}
	});
}

// object for player information. userdata is a user object (https://core.telegram.org/bots/api#user).
function Player(userdata,referrer) {
	this.userdata = userdata,
	this.referrer = referrer, // referrer's id or -1 if does not exist
	this.stickers = [], //list of sticker object https://core.telegram.org/bots/api#sticker
	this.points = 0
}

function startGame(msg) {
	gameChatID = msg.chat.id;
	players = {};
	if(!listening){
		bot.on('message',listenForStickers);
		bot.on('message',newChatMembers);
		listening = true;
	}
	bot.sendMessage(gameChatID,"🎈 StickerCent is Here 🎈\n\
\n\
Design your best nCent Stickers and have a chance to win a 1 ETH prize! Reward will become 2 ETH if the chat room reaches 21k members! 💰\n\
\n\
\n\
👉🏻 Step 1: Design as many nCent Stickers as you can.🖊\n\
👉🏻 Step 2: Publish your stickers in the @ncent chat room and earn 16 points for each sticker that gets selected by the nCent team.\n\
👉🏻 Step 3: The 3 highest scoring players at the end of the competition will each win a 2 ETH prize. 💰(KYC required)\n\
👉🏻 Step 4: Stay awesome! \n\
\n\
🔗Inviting your friends into the @ncent chat room earns you referral points when their sticker is selected! Your referral chain will earn you 8,4,2,1 points Respectively.\n\
\n\
👥Invite your friends to join your team!\n\
\n\
Happy Designing, and may the odds be ever in your favor 🔱");
}


// whenever someone is invited to the group, add the inviter and invitee to the dict of players so that
// the referral  is recorded.
function newChatMembers(msg){
	if(!('new_chat_members' in msg)) return;
	if(msg.from.id == msg.new_chat_members[0].id) return; // someone simply joined without being invited
	if(!(msg.from.id in players)){
		players[msg.from.id] = new Player(msg.from,-1);
	}
	for(var i = 0; i < msg.new_chat_members.length; i++){
		players[msg.new_chat_members[i].id] = new Player(msg.new_chat_members[i],msg.from.id);
	}
	saveData();
}

function awardPoints(playerID,points){
	if(playerID == -1) return;
	players[playerID].points = players[playerID].points + points;
	awardPoints(players[playerID].referrer, 0.5*points);
}

function goodSticker(playerID) {
	awardPoints(playerID,POINTS_PER_STICKER);
	let message = "Congrats @"+players[playerID].userdata.username+" , your sticker has been selected for the nCent sticker pack!  ✔️";
	bot.sendMessage(gameChatID,message);
}


// checks for messages of the form "5 across: guess"
async function listenForStickers(msg){
	// console.log(msg);
	if(!('reply_to_message' in msg)) return;
	if(msg.text != "👍") return;
	if(!('sticker' in msg.reply_to_message) && !('photo' in msg.reply_to_message) && !('video' in msg.reply_to_message)&& !('animation' in msg.reply_to_message)) return;
	let responder = await bot.getChatMember(msg.chat.id, msg.from.id);
	if(responder.status !=  'creator' && responder.status !=  'administrator') return;
	let winner = msg.reply_to_message.from;
	if(!(winner.id in players)){
		// a new unknown player won
		players[winner.id] = new Player(winner,-1);
	}
	goodSticker(winner.id);
	// players[winner.id].stickers.push(msg.reply_to_message.sticker);
	saveData();
}

function giveLeaderboard() {
	// create ordered list of players
	var playerList = Object.keys(players).map(function(key) {
 		return players[key];
	});
	playerList.sort(function(first, second) {
 		return second.points - first.points;
	})
	let message = "Current Leaderboard:"
	// create list descending list of all players with > 0 points.
	for(var i = 0; i < playerList.length; i++){
		if (playerList[i].points == 0) break;
		message = message + "\n@" + playerList[i].userdata.username+ ": "+ playerList[i].points;
	}
	bot.sendMessage(gameChatID,message);
}

function giveStickers() {
	var playerList = Object.keys(players).map(function(key) {
 		return players[key];
	});
	playerList.sort(function(first, second) {
 		return second.points - first.points;
	})
	for(var i = 0; i < playerList.length; i++){
		if (playerList[i].points == 0) break;
		for(var j = 0; j < playerList[i].stickers.length; j++){
			bot.sendSticker(gameChatID,playerList[i].stickers[j].file_id);
		}
	}
}

// gameplay commands that can be sent directly to the bot by the admin. must begin with "@stickerCentBot " so that
// the wordCentBot and stickerCentBot don't respond to the same commands.
// the command "@stickerCentBot /newGame" should be sent to the chat group where the game is to take place.
function adminCommands(msg){
	if(!('text' in msg)) return;
	if(msg.from.username != ADMIN_USERNAME) return;
	if(!msg.text.startsWith("@stickerCentBot") && msg.chat.id != msg.from.id) return;
	let command = msg.text;
	if(msg.text.startsWith("@stickerCentBot")){
		command = msg.text.substring("@stickerCentBot ".length);
	}
	switch(command){
		case '/newGame':
			startGame(msg);
			return;
		case '/show': // log data for debugging
			bot.sendMessage(msg.chat.id,"players:\n"+JSON.stringify(players));
			return;
		case '/giveLeaderboard':
			giveLeaderboard();
			return;
		// case '/giveStickers': // send all the approved stickers
		// 	giveStickers();
		case '/saveData':
			saveData();
			return;
		case '/restartGame':
			restartGame();
			return;
		default:
			return;
	}
}
