# messageBot

This bot will be used to periodically send messages to the nCent Telegram room

## Setup
Create a `secret.env` file that looks like this:
```bash
TOKEN=ISSUED_BOT_TOKEN
CHAT_ID=CHAT_ID
```

## Run
```
sh dockerExec.sh
```

## Stop
```
docker rm -f messageBotContainer
```

## Logs
```
docker logs messageBotContainer
```

## Cron

write a message to send in a txt file, example.txt.
Then to send that message, run "node messageBot.js example.txt"
This will post from nCentBot to the chat with id CHAT_ID.
use crontab to schedule messages to be posted regularly.

crontab -e

0  8,17  *  *  *  node messageBot.js scamWarning.txt
0  12    *  *  Monday  node messageBot.js jurvetson.txt
0  12    *  *  Tuesday  node messageBot.js ravikant.txt
0  12    *  *  Wednesday  node messageBot.js sequoia.
0  12    *  *  Thursday  node messageBot.js winklevoss.txt
0  12    *  *  Friday  node messageBot.js zhenfund.txt
