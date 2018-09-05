docker build -t ncent/spambot .
docker run --name spamBotContainer --env-file ./secret.env ncent/spambot
