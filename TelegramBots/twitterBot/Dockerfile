FROM node:8

ENV TOKEN $TOKEN
ENV CHAT_ID $CHAT_ID

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "twitterBot.js"]
