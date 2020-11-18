const request = require('supertest');
const app = require('../src/app');

const User = require("../src/models/user");
const Message = require("../src/models/message");
const setupDatabase = require('./data/db');
const users = require('./data/user');
const messages = require('./data/message');

setupDatabase();

test('Should signup a new user 1', async () => {
    await request(app).post('/users/signup').send(users.userOne).expect(201);
});

test('Should signup a new user 2', async () => {
    await request(app).post('/users/signup').send(users.userTwo).expect(201);
});

test('Should update a new message 1 from a signed in user 1 to 2', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch(`/messages/message/${users.userTwo.username}`).send(messages.messageOne)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should update a new message 2 from a signed in user 1 to 2', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch(`/messages/message/${users.userTwo.username}`).send(messages.messageTwo)
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should get message of user 2 from a signed in user 1 ', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get(`/messages/message/${users.userTwo.username}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});
