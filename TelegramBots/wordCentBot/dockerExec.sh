docker build -t ncent/wordbot .
docker run --name wordBotContainer --env-file ./secret.env ncent/wordbot
