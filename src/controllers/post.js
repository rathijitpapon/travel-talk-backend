const sharp = require("sharp");

const Post = require("../models/post");

const uploadPost = async (req, res) => {
    const post = new Post(req.body);
    post.ownerId = req.user._id;

    try {
        await post.save();
        await post.populate({
            path: "ownerId",
            select: ["username", "fullname"],
        }).execPopulate();

        res.status(201).send(post);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: "ownerId",
            select: ["username", "fullname"],
        }).exec();

        res.status(200).send(post);
    } catch (error) {
        res.status(404).send({
            message: "Post isn't found.",
        });
    }
};

const getPost = async (req, res) => {
    try {
        const params = Object.keys(req.body);
        const allowedParams = ["limit", "skip"];

        const isValidOperation = allowedParams.every((param) => {
            return params.includes(param);
        });

        if(!isValidOperation) {
            return res.status(400).send({
                message: "Invalid get post request!",
            });
        }

        const posts = await Post.find({
            skip: params.skip,
            limit: params.limit,
        }).populate({
            path: "ownerId",
            select: ["username", "fullname"],
        }).exec();

        res.status(200).send(posts);
    } catch (error) {
        res.status(404).send({
            message: "No post is found.",
        });
    }
};

const editPost = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description"];

    const isValidOperation = allowedUpdates.every((update) => {
        return updates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid edit post request!",
        });
    }

    try {
        const post = await Post.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        allowedUpdates.forEach((update) => {
            post[update] = req.body[update];
        });
    
        await post.save();
        await post.populate({
            path: "ownerId",
            select: ["username", "fullname"],
        }).execPopulate();

        res.status(200).send(post);

    } catch (error) {
        res.status(404).send({
            message: "Post isn't found.",
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        await post.remove();
        res.status(200).send(post);

      } catch (error) {
          res.status(500).send({
            message: "Delete post request is failed.",
        });
      }
};

const updatePostImage = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer)
            .png()
            .toBuffer();

        const post = await Post.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        post.postImage = buffer;
        await post.save();

        res.status(201).send({
            postImage: post.postImage.toString("base64"),
        });
    } catch (error) {
        res.status(400).send({
            message: "Update post image is failed.",
        });
    }
};

const getPostImage = async (req, res) => {
    try {  
        const post = await Post.findById(req.params.id);

        res.status(200).send({
            postImage: post.postImage.toString("base64"),
        });
    } catch (error) {
        res.status(404).send({
            message: "Post image isn't found.'",
        });
    }
};

const deletePostImage = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            ownerId: req.user._id,
        });

        if(!post.postImage) {
            return res.status(404).send({
                message: "Post image isn't found.",
            });
        }

        post.postImage = undefined;
        await post.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: "Delete post image is failed.",
        });
    }
};

const updateReact = async (req, res) => {
    const reacts = Object.keys(req.body);
    const allowedReacts = ["loveReact", "likeReact", "dislikeReact"];

    const isValidOperation = allowedReacts.every((react) => {
        return reacts.includes(react);
    });

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid update react request!",
        });
    }

    try {
        const post = await Post.findById(req.params.id);

        allowedReacts.forEach((react) => {
            let index = -1;
            index = post[react].findIndex(val => val.reactId.equals(req.user._id));

            if(index !== -1) {
                post[react].splice(index, 1);
            }

            if(req.body[react]){
                post[react].push({
                    reactId: req.user._id,
                });
            }
        });

        await post.save();
        await post.populate([
            {
                path: "ownerId",
                select: ["username", "fullname"],
            },
            {
                path: "loveReact.reactId",
                select: ["username", "fullname"],
            },
            {
                path: "likeReact.reactId",
                select: ["username", "fullname"],
            },
            {
                path: "dislikeReact.reactId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send(post);
    } catch (error) {
        res.status(404).send({
            message: "Post isn't found.'",
        });
    }
    
};

const postController = {
    uploadPost,
    getPostById,
    getPost,
    editPost,
    deletePost,
    updatePostImage,
    getPostImage,
    deletePostImage,
    updateReact,
};

module.exports = postController;