const User = require('../../src/models/user');
const Post = require('../../src/models/post');
const Message = require('../../src/models/message');

const setupDatabase = async () => {
    await User.deleteMany();
    await Post.deleteMany();
    await Message.deleteMany();
};

module.exports = setupDatabase;