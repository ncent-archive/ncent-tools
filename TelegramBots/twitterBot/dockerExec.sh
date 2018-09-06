docker build -t ncent/twitterbot .
docker run --name twitterBotContainer --env-file ./secret.env ncent/twitterbot
