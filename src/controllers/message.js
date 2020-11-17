const Message = require("../models/message");
const User = require("../models/user");

const updateMessage = async (req, res) => {
    const fields = Object.keys(req.body);
    const messageFields = ["messageText", "sender"];

    const isValidOperation = messageFields.every((field) => {
        return fields.includes(field);
    });

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid update message request!",
        });
    }

    try {
        const receiver = await User.findOne({
            username: req.body.sender,
        });
        const sender = req.user._id;

        if(!receiver) {
            throw new Error("");
        }

        let message = await Message.findOne({
            user1: receiver._id,
            user2: sender._id,
        });

        if(!message) {
            message = await Message.findOne({
                user1: sender._id,
                user2: receiver._id,
            });
        }

        if(!message) {
            message = new Message({
                user1: sender._id,
                user2: receiver._id,
            });
        }

        message.message.push({
            sender: sender._id,
            messageText: req.body.messageText,
        });

        await message.save();
        await message.populate([
            {
                path: "user1",
                select: ["username", "fullname"],
            },
            {
                path: "user2",
                select: ["username", "fullname"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send(message);
    } catch (error) {
        res.status(400).send({
            message: "Update message is failed.'",
        });
    }
};

const getMessage = async (req, res) => {
    const fields = Object.keys(req.body);
    const messageField = "sender";

    const isValidOperation = fields.includes(messageField);

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid get message request!",
        });
    }

    try {
        const receiver = await User.findOne({
            username: req.body.sender,
        });
        const sender = req.user._id;
        
        let message = await Message.findOne({
            user1: receiver._id,
            user2: sender._id,
        });

        if(!message) {
            message = await Message.findOne({
                user1: sender._id,
                user2: receiver._id,
            });
        }

        if(!message) {
            return res.status(404).send({
                message: "Message isn't found.",
            });
        }

        await message.populate([
            {
                path: "user1",
                select: ["username", "fullname"],
            },
            {
                path: "user2",
                select: ["username", "fullname"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send(message);
    } catch (error) {
        res.status(400).send({
            message: "Get message is failed.'",
        });
    }
};

const messageController = {
    updateMessage,
    getMessage,
};

module.exports = messageController;