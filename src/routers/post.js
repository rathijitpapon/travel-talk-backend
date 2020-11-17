const express = require("express");

const auth = require("../middlewares/auth");
const upload = require("../middlewares/fileUploader");
const postController = require("../controllers/post");

const postRouter = express.Router();

postRouter.post("/post", auth, postController.uploadPost);

postRouter.get("/post/:id", auth, postController.getPostById);

postRouter.get("/post", auth, postController.getPost);

postRouter.patch("/post/:id", auth, postController.editPost);

postRouter.delete("/post/:id", auth, postController.deletePost);

postRouter.patch("/image/:id", auth, upload.single("postImage"), postController.updatePostImage);

postRouter.get("/image/:id", auth, postController.getPostImage);

postRouter.delete("/image/:id", auth, postController.deletePostImage);

postRouter.patch("/react/:id", auth, postController.updateReact);

module.exports = postRouter;