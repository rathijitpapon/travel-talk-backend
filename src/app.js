const express = require("express");
const cors = require("cors");

const initDB = require("./db/mongoose");

const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const messageRouter = require("./routers/message");

var corsOptions = {
    origin: "*"
};

const app = express();

initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(cors(corsOptions));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/messages", messageRouter);

module.exports = app;
