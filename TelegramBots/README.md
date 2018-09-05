# Telegram Bots

These node.js and python scripts are run to bring our telegram bots to life.
To use the node.js scripts, install the telegram api with
```
npm install --save
```

Some scripts are in python because I was using python before and then decided to learn java script. To use these, first run
```
pip install python-telegram-bot
pip install python-twitter
```
The way telegram bots work is you first have to message the BotFather to create a new bot with a certain name and handle. This new bot, by itself doesn't do anything. The BotFather gives you a token, which you use to instantiate a bot object, with which you can use API calls to make the bot do things like listen to messages and send messages.

## Running the bot scripts

### messageBot

Simple bot to send messages to chatrooms. Used to regularly post recurring messages to the nCent Worldwide chat.

write a message to send in a .txt file, example.txt, in the messageBot folder.
Then to send that message, run
```
node postFromTxt.js example.txt
```
This will post from nCentBot to the chat with id CHAT_ID.
use [crontab](http://www.adminschoice.com/crontab-quick-reference) to schedule messages to be posted regularly from your EC2 instance. more crontab information is in messageBot/README.txt

### spamBot

The nCentSpamBot listens for forwarded messages and if someone forwards a message to a group of which they are not an admin, the spamBot quickly removes the message and reminds the sender that forwarding messages is not allowed. This is intended to be used in nCent Nation Worldwide. In order to delete messages, the bot must be made an admin of the group.

The bot runs in a dockerized container.

### twitterBot

The nCentTwitterBot forwards tweets from KK_ncnt, or anyone listed in tweetmap, to the chatrooms listed in chatIdMap. See the code for more details. I wrote the script in python. "python GetChatIDs.py" is called to initialize the file data/chatIdMap.txt, which stores a map of chatroom titles to chatroom IDs. This doesn't need to be called after the file exists and GetChatIDs.py gets chatroom ids from chat updates, so it might not include a chatroom if that chat room doesn't have any recent updates.
Use crontab to schedule "python TwitterToTelegram.py" to run a few times a day. When run, it will look at all the tweets tweeted since the last time it was run, and send the tweets with the most likes to the telegram groups. So it sends at most NUM_TWEETS tweets each time it is run.
tweetmap is a map of twitter username to the tweet id of the last tweet that was tweeted before the last time the script was run. This data is stored so that the script doesn't send the same tweet more than once.

### internalTelegramBot

This bot doesn't do much now, but it could be developed to help manage and keep track of task progress in the company.
To use it, run a postgres database server with the migrations and controllers in internalTelegramAPI.
Run "node internalTelegramInit.js", which tells members of avengers to direct message the bot. While this script is running, if someone messages the bot, that person's telegram id will be added to the chat databse. Bots can't create new chats so this allows the bot to communicate directly with employees. After everyone has messaged the bot (which you can check by looking at the database), you can stop the init script and run "node internalTelegramBot.js". This bot needs an admin to prompt it to do things. Edit internalTelegramBot.js to change the const ADMIN_USERNAME to your telegram handle.
To prompt the bot to do things, you can message it directly. As of now, the available commands are /bugPeople, /postTaskList, and /clearTasks.

/bugPeople prompts the bot to send a message to everyone asking what they are working on. The responses are recorded in the database and the bot is constantly listening for responses as long as the script is running. Responses are by default marked as not completed.

/postTaskList posts a list of all tasks that are not completed.

/clearTasks marks all tasks as completed. Ideally you should be able to mark specific tasks as completed without having to type the whole task description again but that is a job for the future.

### wordCentBot

This bot runs nCent's wordCent games. This bot of course needs to be able to listen to messages. Again, this bot needs an admin to prompt it to do certain things, so edit wordCentBot.js to change ADMIN_USERNAME to your handle so that you can control the bot. Other people will not be able to mess with the bot.
The important commands are /newGame and /automaticHints. Run "node wordCentBot.js" to start the script. You can have it running indefinitely. To start a new game, send "@wordCentBot /newGame" to the chat where you want the game to take place. The bot will then send you a message asking you to input word/clue information. Once you do this, the bot will post a message to the group, saying that the game is starting. You can send commands directly to the bot now. Send /automaticHints to start the bot publishing hints. The bot will give hints at random intervals which you can modify by changing the function, randomTime. You can also tell the bot to give new hints even while automatic hints are going. Tell the bot to post the current leaderboard to the game chat by sending it "/giveLeaderboard".
Note, the referral chains and points are reset when you start a new game.
The script wordCentBot.js should be running as long as the game is happening, but it is constantly saving game data in a file so if it crashes, or you need to stop it to change something, you can just restart it with "node wordCentBot.js" and send the bot the command "/restartGame".
Note, you can only have one game with the same bot going at a time, so wait untill a game has finished (all hints have been given) to start a new game.

### stickerCentBot

This bot is used for the sticker competition. Run "node stickerCentBot.js". Setup is similar to wordCentBot, with admin commands. See the adminCommands function in the code to see the available commands. When an admin of the chatgroup responds with "👍" to a sticker, the person who posted that sticker (and their referral chain) are awarded points. If two admins respond with "👍", or an admin responds with "👍" twice to the same sticker, that person will get more points.

### chatDataBot

Disclaimer: this bot might not be that useful. Also, the code is kinda unorganized because I thought I was under a time constraint when I made it.
This bot keeps track of people who join and are invited to our chat groups when the script is run every minute with crontab. See the readme in chatDataBot for more information.

### other advice

The default security group on ec2 works for all these scripts.
Change ADMIN_USERNAME in the scripts from "andrras" to your telegram username to control the bots.
To keep scripts for spamBot, internalTelegramBot, wordCentBot, and stickerCentBot continually running, run them on different [tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340) instances on an AWS EC2 instance.
