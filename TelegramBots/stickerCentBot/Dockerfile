FROM node:8

ENV TOKEN $TOKEN

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "stickerCentBot.js" ]
