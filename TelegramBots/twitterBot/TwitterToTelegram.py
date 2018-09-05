# run this every hour to send the most popular tweet from the past hour to telegram
# pip install python-twitter
# pip install python-telegram-bot
from telegram import Bot
import twitter
import pickle
import json
import os
import secret

# token for nCentTwitterBot
TOKEN = secret.BOT_TOKEN
bot = Bot(TOKEN)

# Twitter access data
# right now it is using a twitter app that I (Andreas Garcia) signed up for.
# visit the twitter api page to create a new app go get the keys and toekns.
# Consumer Key (API Key)
CONS_KEY = secret.CONS_KEY
# Consumer Secret (API Secret)
CONS_SECRET = secret.CONS_SECRET
# Access Token
ACCESS_TOKEN = secret.ACCESS_TOKEN
# Access Token Secret
ACCESS_TOKEN_SECRET = secret.ACCESS_TOKEN_SECRET

# the max number of tweets to forward everytime this is run.
NUM_TWEETS = 1

testChatid = -1001257002113

# a map of twitter accounts to the tweet id of the last tweet forwarded
# need to store this data so that we forward the right tweets.
# make sure that this file is up to date before running, otherwise you
# might forward way too many tweets.
tweetmap = {"KK_ncnt":0}
tweetmapFilename = os.path.dirname(os.path.realpath(__file__))+"/tweetmap"
with open(tweetmapFilename, 'r') as f:
    tweetmap = json.load(f)

# map of chat.title to chat.id
chatIdMap = {}
filename = os.path.dirname(os.path.realpath(__file__))+"/chatIdMap"
with open(filename, 'r') as f:
    chatIdMap = json.load(f)

api = twitter.Api(consumer_key=CONS_KEY,
                      consumer_secret=CONS_SECRET,
                      access_token_key=ACCESS_TOKEN,
                      access_token_secret=ACCESS_TOKEN_SECRET,
                      tweet_mode='extended')

def favorite_count(tweet):
    return tweet.favorite_count


def forward_tweets():
    for u in tweetmap.keys(): # for each twitter account we're forwarding
        statuses = api.GetUserTimeline(screen_name = u, since_id = tweetmap[u])
        if(statuses == []): continue
        tweetmap[u] = statuses[0].id
        with open(tweetmapFilename, 'w') as f:
            json.dump(tweetmap,f)
        statuses.sort(key = favorite_count,reverse = True) # most popular tweet since the last time this was run
        for tweet in statuses[:NUM_TWEETS]:
            for chat_id in chatIdMap.values(): # send tweet to each chatroom
                bot.sendMessage(chat_id, text=tweet.full_text + "\n- twitter.com/KK_ncnt")

forward_tweets()
