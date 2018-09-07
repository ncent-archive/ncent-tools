docker build -t ncent/stickerbot .
docker run --name stickerBotContainer --env-file ./secret.env ncent/stickerbot
