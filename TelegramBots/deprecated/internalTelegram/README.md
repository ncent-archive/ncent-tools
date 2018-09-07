### internalTelegramBot

This bot doesn't do much now, but it could be developed to help manage and keep track of task progress in the company.
To use it, run a postgres database server with the migrations and controllers in internalTelegramAPI.
Run "node internalTelegramInit.js", which tells members of avengers to direct message the bot. While this script is running, if someone messages the bot, that person's telegram id will be added to the chat databse. Bots can't create new chats so this allows the bot to communicate directly with employees. After everyone has messaged the bot (which you can check by looking at the database), you can stop the init script and run "node internalTelegramBot.js". This bot needs an admin to prompt it to do things. Edit internalTelegramBot.js to change the const ADMIN_USERNAME to your telegram handle.
To prompt the bot to do things, you can message it directly. As of now, the available commands are /bugPeople, /postTaskList, and /clearTasks.

/bugPeople prompts the bot to send a message to everyone asking what they are working on. The responses are recorded in the database and the bot is constantly listening for responses as long as the script is running. Responses are by default marked as not completed.

/postTaskList posts a list of all tasks that are not completed.

/clearTasks marks all tasks as completed. Ideally you should be able to mark specific tasks as completed without having to type the whole task description again but that is a job for the future.
