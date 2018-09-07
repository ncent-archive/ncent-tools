# Telegram Bots
Each dockerized telegram bot has a README explaining how to run it.

### messageBot

Simple bot to send messages to chatrooms. Used to regularly post recurring messages to the nCent Worldwide chat.

### spamBot

The nCentSpamBot listens for forwarded messages and if someone forwards a message to a group of which they are not an admin, the spamBot quickly removes the message and reminds the sender that forwarding messages is not allowed. This is intended to be used in nCent Nation Worldwide. In order to delete messages, the bot must be made an admin of the group.

### twitterBot

This bot forwards new tweets from KK_ncnt to ncent's telegram chatroom

### wordCentBot

This bot runs nCent's wordCent games.

### stickerCentBot

This bot is used for the sticker competition.

## Development Advice

The default security group on ec2 works for all these scripts.
Change ADMIN_USERNAME in the scripts from "andrras" to your telegram username to control the bots.
To keep scripts for spamBot, internalTelegramBot, wordCentBot, and stickerCentBot continually running, run them on different [tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340) instances on an AWS EC2 instance.
