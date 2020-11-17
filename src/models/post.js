const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = new mongoose.Schema(
    {
        title: { 
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        postImage: {
            type: Buffer,
        },
        loveReact: [{
            reactId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }],
        likeReact: [{
            reactId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }],
        dislikeReact: [{
            reactId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }],
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
    },
    {
        timestamps: true,
    }
);

postSchema.plugin(uniqueValidator);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;