const usersController = require('../controllers').users;

module.exports = (app) => {
    app.post('/TelegramUsers/users', usersController.create);
    app.get('/TelegramUsers/users', usersController.list);
    app.get('/TelegramUsers/users/:id', usersController.retrieve);
};