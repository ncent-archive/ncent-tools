# spamBot

This spamBot runs in a docker container. It filters for message forwarding, blacklisted usernames, and blacklisted words in message bodies.

## Setup
Create a `secret.env` file that looks like this:
```bash
TOKEN=ISSUED_BOT_TOKEN
BLACKLISTED_USERNAMES=USERNAME_SUBSTRING,USERNAME_SUBSTRING2
BLACKLISTED_WORDS=WORD_SUBSTRING,WORD_SUBSTRING_2
```

## Run
```
sh dockerExec.sh
```

## Stop
```
docker rm -f spamBotContainer
```

## Logs
```
docker logs spamBotContainer
```
