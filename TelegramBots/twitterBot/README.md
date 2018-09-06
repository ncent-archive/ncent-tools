# twitterBot

This bot will be used to send KKs latest tweet to the chat every 5 minutes.

## Setup

Create a `secret.env` file that looks like this:
```
TOKEN=ISSUED_BOT_TOKEN
CHAT_ID=CHAT_ID
```

## Run
```
sh dockerExec.sh
```

## Stop
```
docker rm -f twitterBotContainer
```

## Logs
```
docker logs twitterBotContainer
```
