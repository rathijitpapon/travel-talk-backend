const express = require("express");

const auth = require("../middlewares/auth");
const messageController = require("../controllers/message");

const messageRouter = express.Router();

messageRouter.patch("/message/:id", auth, messageController.updateMessage);

messageRouter.get("/message/:id", auth, messageController.getMessage);

module.exports = messageRouter;