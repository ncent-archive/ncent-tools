"use strict";
// run node wordCentBot.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
// token for wordCentBot
const token = require('./.secret.js').wordCentBot;
const avengersChatid = -1001250878096;
const testChatid = -1001257002113;
const ADMIN_USERNAME = "Cryptopit";
const POINTS_PER_WORD = 16;
const WARNING_PERIOD = 120; // seconds
// change to suit file system.
const DATA_FILENAME = __dirname + "/wordGameData";

// global state variables
var gameChatID = 0;			// telegram chat id of the chat room where the game is
var words = {};				// dictionary of all words by id(order)
var numWords = 0;			// total number of words
var players = {};			// dictionary of players by telegram id
var nextWord = 0; 			// the id of the word whose clue should be given next.
var openWords = [];			// array of open word ids whose hints have been published
var automaticHints = false; // becomes true if hints are being published automatically
var listening = false;

const bot = new TelegramBot(token, {polling: true});
//turn on admin gameplay commands
bot.on('message', adminCommands);

// game state object
function gameData() {
	this.gameChatID = gameChatID;
	this.words = words;
	this.numWords = numWords;
	this.players = players;
	this.nextWord = nextWord;
	this.openWords = openWords;
	this.automaticHints = automaticHints;
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
	words = data.words;
	numWords = data.numWords;
	players = data.players;
	nextWord = data.nextWord;
	openWords = data.openWords;
	automaticHints = data.automaticHints;
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
			bot.on('message',listenForWords);
			bot.on('message',newChatMembers);
			listening = true;
		}
		if(automaticHints == true) {
			startAutomaticHints();
		}
	});
}

// object for player information. userdata is a user object (https://core.telegram.org/bots/api#user).
function Player(userdata,referrer) {
	this.userdata = userdata,
	this.referrer = referrer, // referrer's id or -1 if does not exist
	this.points = 0
}

// word id is the order in which the words are added.
function Word(position,word,hint,id) {
	this.word = word,
	this.hint = hint,
	this.id = id,
	this.position = position,
	this.guessers = [], //list of id's of users who have attempted to guess this word
	this.winner = 0		// id of user who won this word
}


function startGame() {
	players = {};
	nextWord = 0;
	openWords = [];
	automaticHints = false;
	if(!listening){
		bot.on('message',listenForWords);
		bot.on('message',newChatMembers);
		listening = true;
	}
	bot.sendMessage(gameChatID,"🎈 WordCent Weekly Competition 🎈\n\
\n\
Learn about nCent and win a weekly 1 ETH prize 💰\n\
\n\
👉🏻 Step 1: Hints will be released randomly in @ncent chat.\n\
👉🏻 Step 2: Be the first to guess the right word into the @ncent chat room and earn 16 points and your referral chain will earn 8, 4, 2, 1 respectively\n\
NOTE: You can only guess once per word so choose wisely! Other answers will be ignored.\n\
👉🏻 Step 3: The highest scoring player at the end of the competition wins the prize. 💰(KYC required)\n\
👉🏻 Step 4: Stay awesome! \n\
\n\
🔗Inviting your friends into the @ncent chat room earns you referral points when they solve a clue! Your referral chain will earn you 8,4,2,1 points Respectively.\n\
👥Invite your friends to join your team!\n\
\n\
Happy Solving, and may the odds be ever in your favor 🔱");
}

// after user has typed /newGame, wait for the user to input game word data.
// expects a block of text of form:
// 		1 across, word, hint
// 		5 down, word, hint
//		etc...
// hints are given in order from top to bottom.
function getWordHintList(msg){
	if(!('text' in msg)) return;
	if(msg.from.username != ADMIN_USERNAME) return;
	bot.off('message',getWordHintList);
	if(msg.text == '/cancel'){
		bot.sendMessage(msg.from.id,"canceled");
		return;
	}
	let wordHintList = msg.text.toLowerCase().split('\n');
	words = {};
	numWords = wordHintList.length;
	for(var i = 0; i < numWords;i++){
		let data = wordHintList[i].split(', ');
		words[i] = new Word(data[0],data[1],data[2],i);
	}
	startGame();
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

function correctAnswer(playerID,wordID) {
	words[wordID].winner = playerID;
	awardPoints(playerID,POINTS_PER_WORD);
	let message = "Congrats @"+players[playerID].userdata.username+" , That’s Correct! ✔️";
	bot.sendMessage(gameChatID,message);
}

function incorrectAnswer(playerID,wordID){
	// bot.sendMessage(gameChatID,"sorry, that is incorrect");
}

// checks if a and b match, ignoring case and spaces
function matches(a,b){
	return a.toLowerCase().replace(/\s/g, '') == b.toLowerCase().replace(/\s/g, '');
}


// checks for messages of the form "5 across: guess"
function listenForWords(msg){
	if(!('text' in msg)) return;
	// assume guess is in form "5 across: guess"
	let guess = msg.text.toLowerCase().replace(/\s/g, '').split(':');
	let guesser = msg.from;
	for(var i = 0; i < openWords.length; i++){
		if(matches(guess[0],words[openWords[i]].position)){
			// someone attempted to answer an open word
			if(!(guesser.id in players)){
				// a new player
				players[guesser.id] = new Player(guesser,-1);
			}
			if(words[openWords[i]].guessers.includes(guesser.id)){
				bot.sendMessage(gameChatID,"Hey @"+guesser.username+", you already guessed! 😕");
				return;
			}
			words[openWords[i]].guessers.push(guesser.id);
			if(matches(guess[1],words[openWords[i]].word)){
				correctAnswer(guesser.id,openWords[i]);
				openWords.splice(i,1); // remove this word from the list of open words.
			} else {
				incorrectAnswer(guesser.id,openWords[i]);
			}
			saveData();
			return;
		}
	}
}

// formats message for word with id wordID as "5 across: hint"
function hintMessage(wordID){
	return words[wordID].position+": "+words[wordID].hint;
}

// clue and hint mean the same thing.
function giveNewClue(){
	var message = "";
	if(openWords.length > 0){
		message = "Previous clues:";
		for (var i = 0; i < openWords.length; i++){
			message = message + "\n" + hintMessage(openWords[i]);
		}
	}
	message = message + "\nNew clue:";
	message = message + "\n" + hintMessage(nextWord);
	bot.sendMessage(gameChatID,message);
	openWords.push(nextWord);
	nextWord++;
	saveData();
}

// called when admin sends /newGame within the chat group for that game.
function setupNewGame(msg) {
	gameChatID = msg.chat.id;
	bot.sendMessage(msg.from.id,
		"Please send the list of words and hints as follows:\n1 across, word, hint\n5 down, word, hint\netc...\n\
		send \"/cancel\" to cancel", {forceReply:true});
	bot.on('message',getWordHintList);
}

function giveWarning() {
	bot.sendMessage(gameChatID,"🚨 WORDCENT IS COMING....2 MINUTE WARNING! 🚨");
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

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, 1000*sec));
}

// determine the rest time in seconds until the next hint based on r uniform in [0,1)
function randomTime(r) {
	return 10*60*60+10*60*60*r;
}

async function startAutomaticHints(){
	automaticHints = true;
	while(nextWord < numWords){
		giveWarning();
		await sleep(2*60);
		giveNewClue();
		let r = Math.random();
		let breakTime = randomTime(r);
		await sleep(breakTime);
		if(!automaticHints) break;
	}
}

// gameplay commands that can be sent directly to the bot by the admin. If not in a direct message,
// the message must begin with "@wordCentBot " so that
// the wordCentBot and stickerCentBot don't respond to the same commands.
// the command /newGame should be sent to the chat group where the game is to take place.
function adminCommands(msg){
	if(!('text' in msg)) return;
	// if(gameChatID == 0 && msg.text == '/newGame') {
	// 	//game hasn't been initialized
	// 	let sender = await bot.getChatMember(msg.chat.id, msg.from.id);
	// 	if(sender.status ==  'creator' || sender.status ==  'administrator') {

	// 	}
	// }
	if(msg.from.username != ADMIN_USERNAME) return;
	if(!msg.text.startsWith("@wordCentBot") && msg.chat.id != msg.from.id) return;
	let command = msg.text;
	if(msg.text.startsWith("@wordCentBot")){
		command = msg.text.substring("@wordCentBot ".length);
	}
	switch(command){
		case '/newGame':
			setupNewGame(msg);
			return;
		case '/show': // log data for debugging. (don't call this in the chat or you will reveal answers)
			let message = "\nplayers:\n" +JSON.stringify(players)+"\nwords:\n"+JSON.stringify(words)+"\nopen words:\n"+JSON.stringify(openWords);
			bot.sendMessage(msg.chat.id,message);
			return;
		case '/giveNewClue':
			giveNewClue();
			return;
		case '/giveWarning':
			giveWarning();
			return;
		case '/giveLeaderboard':
			giveLeaderboard();
			return;
		case '/automaticHints':
			startAutomaticHints();
			return;
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
