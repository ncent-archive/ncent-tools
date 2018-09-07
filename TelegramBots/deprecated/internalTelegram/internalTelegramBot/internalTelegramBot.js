const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");
const db = "http://localhost:8050/api";
// replace the value below with the Telegram token you receive from @BotFather
const token = require('./.secret.js').internalBot;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const testChatid =-1001257002113;
const avengersChatid = -1001250878096;
const ADMIN_USERNAME = 'andrras'


console.log("correct");

function postTaskList() {
  axios.get(db+'/tasks')
    .then(function(response){
      var message = "Here's what's going on:";
      for(var i = 0; i < response.data.length; i++){
        if(!response.data[i].completed){
          var message = message + '\n'+response.data[i].Name + ": " + response.data[i].description;
        }
      }
      bot.sendMessage(avengersChatid,message);
      console.log(message);
    })
    .catch(function(error){
      console.log('error');
      console.log(error.message);
    })
}

// update all tasks to complete
function clearTasks() {
  console.log("here");
   axios.get(db+'/tasks')
    .then(function(response){
      for(var i = 0; i < response.data.length; i++){
        var uuid = response.data[i].uuid;
        console.log(uuid);
        axios.put(db+'/tasks/'+uuid)
        .catch(function(error){
          console.log('error');
          console.log(error.message);
        })
      }
    })
    .catch(function(error){
      console.log('error');
      console.log(error.message);
    })
}

function botOn(){
  bot.on('message', (msg) => {
        name = msg.from.first_name + ' ' + msg.from.last_name;
        chatid = msg.from.id;
        if(msg.text.substring(0,2).toLowerCase() == "no"){
          bot.sendMessage(chatid,"Keep up the good work! :^) let me know if you do something else");
          // bot.off('message');
          return;
        }
        if(msg.from.username == ADMIN_USERNAME && msg.text == '/bugPeople'){
          bugPeople();
        } else if(msg.from.username == ADMIN_USERNAME && msg.text == '/postTaskList'){
          postTaskList();
        } else if(msg.from.username == ADMIN_USERNAME && msg.text == '/clearTasks'){
          clearTasks();
        } else {
        axios.post(db + '/tasks', {
          Name: name,
          description: msg.text
        })
        .then(function(res) {
          bot.sendMessage(chatid,"Nice! Anything else? (if not, say \"no\")");
        })
        .catch(function(error){
          console.log("post error");
          console.log(error.message);
        });
      }
      });
}

function bugPeople() {
  axios.get(db+'/chats')
    .then(function(response) {
      const chatList = response.data;
      for (var i = 0; i < chatList.length; i++) {
        bot.sendMessage(chatList[i].id,"Hey, what have you been working on? :^)");
      }
    })
    .catch(function(error){
      console.log("error");
      console.log(error.message);
    });
}
botOn();
