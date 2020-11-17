const express = require("express");

const auth = require("../middlewares/auth");
const messageController = require("../controllers/message");

const messageRouter = express.Router();

messageRouter.patch("/message", auth, messageController.updateMessage);

messageRouter.get("/message", auth, messageController.getMessage);

module.exports = messageRouter;