const Message = require("../models/message");
const Joi = require("joi");
const schema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().required(),
  ts: Joi.required(),
});
module.exports = (app) => {
  const validateMessage = (req, res, next) => {
    const { error } = schema.validate({
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    });

    if (error) {
      return res.status(400).send(error.details);
    }

    next();
  };

  app.get("/chat/api/messages", (req, res) => {
    Message.findAll().then((result) => {
      res.send(result);
    });
  });

  app.get("/chat/api/messages/:ts", (req, res) => {
    Message.findByPk(req.params.ts).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send(response);
    });
  });

  app.post("/chat/api/messages", validateMessage, (req, res) => {
    Message.create({
      message: req.body.message,
      author: req.body.author,
      ts: req.body.ts,
    }).then((response) => {
      res.send(response);
    });
  });

  app.put("/chat/api/messages/:ts", validateMessage, (req, res) => {
    Message.update(req.body, {
      where: { ts: req.params.ts },
    }).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send(response);
    });
  });

  app.delete("/chat/api/messages/:ts", (req, res) => {
    Message.destroy({
      where: { ts: req.params.ts },
    }).then((response) => {
      if (response === null) {
        return res.status(404).send("No se encontró el mensaje con el ts dado");
      }
      res.send("Deleted");
    });
  });
};
