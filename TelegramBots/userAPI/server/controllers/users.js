const User = require('../models').User;

module.exports = {
  create(req, res) {
    return User
      .create({
        id: req.body.id,
        username: req.body.username,
        referrer: req.body.referrer,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .findAll({
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return User
    .findAll({
      where: {
        id: req.params.id
      }
    })
    .then(user => {
      if (!user || user.length < 1 ) {
        return res.status(204).send({
          message: 'User Not Found',
        });
      } else {
        return res.status(200).send(user);
      }
    })
    .catch(error => res.status(400).send(error));
  }
};