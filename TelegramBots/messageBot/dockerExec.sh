docker build -t ncent/messagebot .
docker run --name messageBotContainer --env-file ./secret.env ncent/messagebot
