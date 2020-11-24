const Message = require("../models/message");
const User = require("../models/user");

const updateMessage = async (req, res) => {
    const fields = Object.keys(req.body);
    const messageFields = ["messageText"];

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
            username: req.params.id,
        });
        const sender = req.user;

        if (!receiver) {
            return res.status(400).send({
                message: "Invalid update message request!",
            });
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
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "user2",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname", "profileImage"],
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
    try {
        const receiver = await User.findOne({
            username: req.params.id,
        });
        const sender = req.user;

        if (!receiver) {
            return res.status(400).send({
                message: "Invalid get message request!",
            });
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
            return res.status(404).send({
                message: "Message isn't found.",
            });
        }

        await message.populate([
            {
                path: "user1",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "user2",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname", "profileImage"],
            }
        ]).execPopulate();

        res.status(200).send(message);
    } catch (error) {
        res.status(400).send({
            message: "Get message is failed.'",
        });
    }
};

const sendMessage = async (sender, receiverUsername, messageText) => {
    
    const receiver = await User.findOne({
        username: receiverUsername,
    });

    if (!receiver) {
        return {
            error: "Invalid update message request!",
        };
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
        messageText: messageText,
    });

    await message.save();
    await message.populate([
        {
            path: "user1",
            select: ["username", "fullname", "profileImage"],
        },
        {
            path: "user2",
            select: ["username", "fullname", "profileImage"],
        },
        {
            path: "message.sender",
            select: ["username", "fullname", "profileImage"],
        }
    ]).execPopulate();

    return {
        message,
        receiver,
    };
};

const getInbox = async (user1, username) => {
    
    const user2 = await User.findOne({
        username: username,
    });

    if (!user2) {
        return {
            error: "Invalid get message request!",
        };
    }
    
    let message = await Message.findOne({
        user1: user1,
        user2: user2,
    });
    if(!message) {
        message = await Message.findOne({
            user1: user2,
            user2: user1,
        });
    }

    if(!message) {
        return {
            error: "No Message Found"
        };
    }
    else{
        await message.populate([
            {
                path: "user1",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "user2",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname", "profileImage"],
            }
        ]).execPopulate();
    }

    return {
        message,
    };
};

const getAllMessages = async (user) => {
    
    let messages1 = await Message.find({
        user1: user,
    }).sort({updatedAt: -1}).populate([
        {
            path: "user1",
            select: ["username", "fullname", "profileImage"],
        },
        {
            path: "user2",
            select: ["username", "fullname", "profileImage"],
        },
        {
            path: "message.sender",
            select: ["username", "fullname", "profileImage"],
        }
    ]).exec();

    let messages2 = await Message.find({
            user2: user,
        }).sort({updatedAt: -1}).populate([
            {
                path: "user1",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "user2",
                select: ["username", "fullname", "profileImage"],
            },
            {
                path: "message.sender",
                select: ["username", "fullname", "profileImage"],
            }
        ]).exec();

    const messages = [...messages1, ...messages2];

    return {
        messages: messages,
    };
};

const messageController = {
    updateMessage,
    getMessage,
    sendMessage,
    getInbox,
    getAllMessages,
};

module.exports = messageController;