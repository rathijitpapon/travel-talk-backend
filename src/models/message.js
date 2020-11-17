const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const messageSchema = new mongoose.Schema(
    {
        user1: { 
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
            required: true,
        },
        user2: { 
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
            required: true,
        },
        message: [{
            sender: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "User",
                required: true,
            },
            messageText: {
                type: String,
                required: true,
                trim: true,
            }
        }],
    },
    {
        timestamps: true,
    }
);

messageSchema.plugin(uniqueValidator);
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;