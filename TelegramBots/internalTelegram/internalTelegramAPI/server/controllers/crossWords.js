// maybe add a field for if someone wants to stop receiving messages from the bot.
const CrossWord = require('../models').CrossWord;
module.exports = {
  create(req, res) {
    return Chat
      .create({
        Name: req.body.Name,
        id: req.body.id,
      })
      .then(Chat => res.status(201).send(Chat))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Chat
      .findAll({
      })
      .then(Chats => res.status(200).send(Chats))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return Chat
      .findById(req.params.id, {
       })
      .then(Chat => {
        if (!Chat) {
          return res.status(404).send({
            message: 'Chat Not Found',
          });
        }
        return res.status(200).send(Chat);
      })
      .catch(error => res.status(400).send(error));
  },
};