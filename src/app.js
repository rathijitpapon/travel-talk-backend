const express = require("express");
const cors = require("cors");
const socketio = require('socket.io');
const http = require('http');

const initDB = require("./db/mongoose");

const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const messageRouter = require("./routers/message");

var corsOptions = {
    origin: "*",
};

const app = express();
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     next();
// });

initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(cors(corsOptions));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/messages", messageRouter);

const server = http.createServer(app);
const io = socketio(server);

const auth = async (token) => {
    const jwt = require("jsonwebtoken");
    const User = require("./models/user");
    const JWT_SECRET = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
    });

    if(!user) {
        return {
            error: "Authentication unsuccessful.",
        };
    }

    return {
        user
    };
}

io.on("connect", socket => {
    const {sendMessage, getInbox, getAllMessages} = require("./controllers/message");

    socket.on("joinMessages", async (data, cb) => {
        const userData = await auth(data.token);
        if(userData.error) {
            cb(userData.error);
        }

        const messageData = await getAllMessages(userData.user._id);

        socket.join(userData.user._id.toString());
        io.to(userData.user._id.toString()).emit("getMessages", {messages: messageData.messages});
    });
    
    socket.on("joinInbox", async (data, cb) => {
        const userData = await auth(data.token);
        if(userData.error) {
            cb(userData.error);
        }

        const inboxData = await getInbox(userData.user._id, data.username);

        if(inboxData.error) {
            cb(inboxData.error);
        }

        socket.join(inboxData.message._id.toString());
        io.to(inboxData.message._id.toString()).emit("getInbox", {inbox: inboxData.message});
    });

    socket.on("sendText", async (data, cb) => {
        const userData = await auth(data.token);
        if(userData.error) {
            cb(userData.error);
        }

        const inboxData = await sendMessage(userData.user, data.username, data.messageText);
        if(inboxData.error) {
            cb(inboxData.error);
        }

        const messageData = await getAllMessages(userData.user._id);

        io.to(inboxData.message._id.toString()).emit("getInbox", {inbox: inboxData.message});
        io.to(userData.user._id.toString()).emit("getMessages", {messages: messageData.messages});
        io.to(inboxData.receiver._id.toString()).emit("getMessages", {messages: messageData.messages});
        
    });
});

module.exports = server;
