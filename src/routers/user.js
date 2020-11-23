const express = require("express");

const auth = require("../middlewares/auth");
const upload = require("../middlewares/fileUploader");
const userController = require("../controllers/user");

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);

userRouter.post("/signin", userController.signin);

userRouter.put("/signout", auth, userController.signout);

userRouter.put("/signout/all", auth, userController.signoutAll);

userRouter.put("/profile/:id", auth, userController.getProfile);

userRouter.patch("/profile", auth, userController.editProfile);

userRouter.delete("/profile", auth, userController.deleteProfile);

userRouter.patch("/password", auth, userController.editPassword);

userRouter.patch("/password/forget/:id", userController.forgetPassword);

userRouter.put("/email", auth, userController.getEmail);

userRouter.patch("/image", auth, userController.updateProfileImage);

userRouter.put("/image/:id", auth, userController.getProfileImage);

userRouter.delete("/image", auth, userController.deleteProfileImage);

userRouter.patch("/follow/:id", auth, userController.updateFollowUser);

module.exports = userRouter;