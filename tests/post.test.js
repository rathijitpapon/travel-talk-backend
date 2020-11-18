const request = require('supertest');
const app = require('../src/app');

const User = require("../src/models/user");
const Post = require("../src/models/post");
const setupDatabase = require('./data/db');
const users = require('./data/user');
const posts = require('./data/post');

setupDatabase();

test('Should signup a new user 1', async () => {
    await request(app).post('/users/signup').send(users.userOne).expect(201);
});

test('Should signup a new user 2', async () => {
    await request(app).post('/users/signup').send(users.userTwo).expect(201);
});

test('Should upload a new post 1 from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).post('/posts/post').send(posts.postOne)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(201);
});

test('Should upload a new post 2 from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).post('/posts/post').send(posts.postTwo)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(201);
});

test('Should get post by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).get(`/posts/post/${post._id}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should get post from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).get('/posts/post').send({
        limit: 10,
        skip: 0,
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should edit post by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).patch(`/posts/post/${post._id}`).send({
        title: posts.postOne.title,
        description: posts.postOne.description,
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should delete post by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postTwo.title,
    })

    await request(app).delete(`/posts/post/${post._id}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should update post image by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).patch(`/posts/image/${post._id}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .attach("postImage", "tests/data/postImage.jpg")
    .expect(201);
});

test('Should get post image by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).get(`/posts/image/${post._id}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should delete post image by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).delete(`/posts/image/${post._id}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should update react by id from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    const post = await Post.findOne({
        title: posts.postOne.title,
    })

    await request(app).patch(`/posts/react/${post._id}`).send({
        loveReact: true,
        likeReact: false,
        dislikeReact: false,
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});