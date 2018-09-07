# stickerCentBot

## Setup
Create a `secret.env` file that looks like this:
```bash
TOKEN=ISSUED_BOT_TOKEN
```

See the adminCommands function in the code to see the available commands. When an admin of the chat group responds with "👍" to a sticker, the person who posted that sticker (and their referral chain) are awarded points. If two admins respond with "👍", or an admin responds with "👍" twice to the same sticker, that person will get more points.

## Run
```
sh dockerExec.sh
```

## Stop
```
docker rm -f stickerBotContainer
```

## Logs
```
docker logs stickerBotContainer
```
