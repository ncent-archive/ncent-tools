# twitterBot

This bot will be used to send KKs latest tweet to the chat every 5 minutes.

## Setup

Create a `secret.env` file that looks like this:
```
TOKEN=ISSUED_BOT_TOKEN
CHAT_ID=CHAT_ID
CONS_KEY=YOUR_API_KEY
CONS_SECRET=YOUR_API_KEY
ACCESS_TOKEN=YOUR_API_KEY
ACCESS_TOKEN_SECRET=YOUR_API_KEY
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
