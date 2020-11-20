const request = require('supertest');
const app = require('../src/app');

const User = require("../src/models/user");
const setupDatabase = require('./data/db');
const users = require('./data/user');

setupDatabase();

test('Should signup a new user 1', async () => {
    await request(app).post('/users/signup').send(users.userOne).expect(201);
});

test('Should signup a new user 2', async () => {
    await request(app).post('/users/signup').send(users.userTwo).expect(201);
});

test('Should signin for a existing user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    }).expect(200);
});

test('Should signout from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get('/users/signout').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should signout all from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });

    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get('/users/signout/all').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should get profile from any signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get(`/users/profile/${user.username}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should edit profile from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch('/users/profile').send({
        "fullname": "Rathijit Paul Papon",
        "description": "Hi, I'm a developer.",
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should delete profile from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).delete('/users/profile').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);

    await request(app).post('/users/signup').send(users.userOne);
});

test('Should edit password from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch('/users/password').send({
        password: users.userOne.password,
    })
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should forget password from user', async () => {
    await request(app).patch(`/users/password/forget/${users.userOne.email}`).send()
    .expect(200);
});

test('Should get email from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get('/users/email').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should update profile image from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch('/users/image').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .attach("profileImage", "tests/data/profileImage.jpg")
    .expect(201);
});

test('Should get profile image from any signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).get(`/users/image/${user.username}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should delete profile image from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).delete('/users/image').send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(200);
});

test('Should follow user from a signed in user', async () => {
    await request(app).post('/users/signin').send({
        username: users.userOne.username,
        password: users.userOne.password,
    });
    
    const user = await User.findOne({ 
        username: users.userOne.username,
    });

    await request(app).patch(`/users/follow/${users.userTwo.username}`).send()
    .set("Authorization", `Bearer ${user.tokens[0].token}`)
    .expect(201);
});