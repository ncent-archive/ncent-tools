write a message to send in a txt file, example.txt.
Then to send that message, run "node postFromTxt.js example.txt"
This will post from nCentBot to the chat with id CHAT_ID.
use crontab to schedule messages to be posted regularly.

crontab -e

0  8,17  *  *  *  node postFromTxt.js scamWarning.txt
0  12    *  *  1  node postFromTxt.js jurvetson.txt
0  12    *  *  2  node postFromTxt.js ravikant.txt
0  12    *  *  3  node postFromTxt.js sequoia.
0  12    *  *  4  node postFromTxt.js winklevoss.txt
0  12    *  *  5  node postFromTxt.js zhenfund.txt