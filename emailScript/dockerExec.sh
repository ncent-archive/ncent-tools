docker build -t ncent/ses .
docker run --name sesContainer --env-file ./secret.env ncent/ses
