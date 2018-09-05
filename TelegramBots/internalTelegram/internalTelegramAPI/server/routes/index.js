const chatsController = require('../controllers').chats;
const tasksController = require('../controllers').tasks;


module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Telegram API!',
    }));
    app.post('/api/tasks', tasksController.create);
    app.get('/api/tasks', tasksController.list);
    app.get('/api/tasks/:Name', tasksController.listByName);
    app.put('/api/tasks/:uuid', tasksController.update);

    app.post('/api/chats', chatsController.create);
    app.get('/api/chats', chatsController.list);
    app.get('/api/chats/:id', chatsController.retrieve);
};