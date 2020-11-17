const Message = require("../models/message");
const User = require("../models/user");

const updateMessage = async (req, res) => {
    const fields = Object.keys(req.body);
    const messageFields = ["messageText", "sender"];

    const isValidOperation = fields.every((field) => {
        return messageFields.includes(field);
    });

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid update message request!",
        });
    }

    try {
        const receiver = await User.find({
            username: fields.sender,
        });
        const sender = req.user._id;

        if(!receiver) {
            throw new Error("");
        }
        
        let message;

        await Message.findOne({
            user1: receiver._id,
            user2: sender._id,
        }, 
        async (error1, msg1) => {
            if(error1) {
                await Message.findOne({
                    user1: sender._id,
                    user2: receiver._id,
                }, 
                async (error2, msg2) => {
                    if(error2) {
                        message = new Message({
                            user1: sender._id,
                            user2: receiver._id,
                            message: [],
                        });
                    } else {
                        message = msg2;
                    }
                });
            } else{
                message = msg1;
            }
        });

        message.message.push({
            sender: sender._id,
            messageText: fields.messageText,
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
        const receiver = await User.find({
            username: fields.sender,
        });
        const sender = req.user._id;
        
        let message;

        await Message.findOne({
            user1: receiver._id,
            user2: sender._id,
        }, 
        async (error1, msg1) => {
            if(error1) {
                await Message.findOne({
                    user1: sender._id,
                    user2: receiver._id,
                }, 
                async (error2, msg2) => {
                    if(error2) {
                        return res.status(404).send({
                            message: "Message isn't found.",
                        });
                    } else {
                        message = msg2;
                    }
                });
            } else{
                message = msg1;
            }
        });

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