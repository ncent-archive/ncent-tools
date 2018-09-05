# run this to generate the chatIdMap file, which stores
# a map of all chatroom titles to there id's for chat rooms that
# the bot is on, and that have updates to report.

from telegram import Bot
import os.path
import json
import secret

# token for nCentTwitterBot
token= secret.BOT_TOKEN
bot = Bot(token)
chatIdMap = {}
filename = os.path.dirname(os.path.realpath(__file__))+"/"+"chatIdMap"
if(os.path.isfile(filename)):
    with open(filename, 'r') as f:
        chatIdMap = json.load(f)

updates = bot.getUpdates()
for update in updates:
	print(update)
	chatIdMap[update.message.chat.title] = update.message.chat.id

with open(filename, 'w') as f:
    json.dump(chatIdMap,f)
