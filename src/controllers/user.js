const sharp = require("sharp");

const User = require("../models/user");
const emailNotification = require("../services/email");

const signup = async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        await user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        emailNotification.sendWelcomeEmail(user.email, user.fullname);
        res.status(201).send({
            user,
            token,
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const signin = async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await user.generateAuthToken();

        await user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send({
            user,
            token,
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const signout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });

        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: "Sign out request failed.",
        });
    }
};

const signoutAll = async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: "Sign out request failed.",
        });
    }
};

const getProfile = async (req, res) => {
    try {
        let user;
        if(req.params.id === "my") {
            user = req.user;
        }
        else{
            user = await User.findOne({
                username: req.params.id,
            });
        }

        if (!user) {
            throw new Error("");
        }

        await user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send(user)
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const editProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullname", "description"];

    const isValidOperation = allowedUpdates.every((update) => {
        return updates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid edit profile request!",
        });
    }

    try {
        allowedUpdates.forEach((update) => {
            req.user[update] = req.body[update];
        });
    
        await req.user.save();
        await req.user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(200).send(req.user);

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        await req.user.remove();
        await req.user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        emailNotification.sendCancelationEmail(req.user.email, req.user.fullname);
        res.status(200).send(req.user);

      } catch (error) {
        res.status(500).send({
            message: "Delete profile request is failed.",
        });
      }
};

const editPassword = async (req, res) => {
    const updates = Object.keys(req.body);
    const passwordField = "password";
    const isValidOperation = updates.includes(passwordField);

    if (!isValidOperation) {
        return res.status(400).send({
            message: "Invalid edit password request!",
        });
    }

    try {
        req.user[passwordField] = req.body[passwordField];
    
        await req.user.save();
        await req.user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();
        res.status(200).send(req.user);

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.params.id,
        });
        
        if(!user) {
            throw new Error("Email isn't registered.");
        }

        const randomPassword = Math.random().toString(36).substring(2, 15);
        user.password = randomPassword;
        await user.save();

        emailNotification.sendForgetPasswordEmail(user.email, user.fullname, randomPassword);
        res.status(200).send();

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
}

const getEmail = async (req, res) => {
    res.status(200).send({
        email: req.user.email,
    });
};

const updateProfileImage = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer)
            .png()
            .toBuffer();

        req.user.profileImage = buffer;
        await req.user.save();

        res.status(201).send({
            profileImage: req.user.profileImage.toString("base64"),
        });
    } catch (error) {
        res.status(400).send({
            message: "Update profile image is failed.",
        });
    }
};

const getProfileImage = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.id,
        });
    
        if (!user || !user.profileImage) {
          throw new Error("Profile image isn't found.");
        }
    
        res.status(200).send({
            profileImage: user.profileImage.toString("base64"),
        });
    } catch (error) {
        res.status(404).send({
            message: "Profile image isn't found.'",
        });
    }
};

const deleteProfileImage = async (req, res) => {
    if(!req.user.profileImage) {
        return res.status(404).send({
            message: "Profile image isn't found.",
        });
    }

    try {
        req.user.profileImage = undefined;
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: "Delete profile image is failed.",
        });
    }
};

const updateFollowUser = async (req, res) => {
    try {
        const followingUser = await User.findOne({
            username: req.params.id,
        });
    
        if (!followingUser) {
          throw new Error("User isn't found.");
        }

        let index = -1;
        index = req.user.following.findIndex(val => val.userId.equals(followingUser._id));

        if(req.user._id.equals(followingUser._id)) {
            throw new Error("Following is failed.");
        }
        else if(index !== -1) {
            req.user.following.splice(index, 1);

            index = followingUser.followers.findIndex(val => val.userId.equals(req.user._id));
            if(index !== -1) {
                followingUser.followers.splice(index, 1);
            }
        }
        else {
            req.user.following.push({
                userId: followingUser._id,
            });

            followingUser.followers.push({
                userId: req.user._id,
            });
        }

        await req.user.save();
        await followingUser.save();
        
        await req.user.populate([
            {
                path: "followers.userId",
                select: ["username", "fullname"],
            },
            {
                path: "following.userId",
                select: ["username", "fullname"],
            }
        ]).execPopulate();

        res.status(201).send(req.user);

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const userController = {
    signup,
    signin,
    signout,
    signoutAll,
    getProfile,
    editProfile,
    deleteProfile,
    editPassword,
    forgetPassword,
    getEmail,
    updateProfileImage,
    getProfileImage,
    deleteProfileImage,
    updateFollowUser,
};

module.exports = userController;