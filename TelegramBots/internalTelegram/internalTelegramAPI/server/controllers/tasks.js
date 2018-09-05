const Task = require('../models').Task;

module.exports = {
 create(req, res) {
  return Task
    .create({
      Name: req.body.Name,
      description: req.body.description,
      completed: req.body.completed,
    })
    .then(Task => res.status(201).send(Task))
    .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Task
      .findAll({})
      .then(Tasks => res.status(200).send(Tasks))
      .catch(error => res.status(400).send(error));
  },
  listByName(req, res) {
    return Task
      .findAll( {where: {
        Name: req.params.Name
        // [Op.and]: {completed: req.body.completed}
      }})
      .then(Tasks => res.status(200).send(Tasks))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
  return Task
    .findById(req.params.uuid)
    .then(task => {
      if (!task) {
        return res.status(404).send({
          message: 'Task Not Found',
        });
      }
      return task
        .update({
          completed: true,
        })
        .then(() => res.status(200).send(task))  // Send back the updated tokentype.
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
  },
};