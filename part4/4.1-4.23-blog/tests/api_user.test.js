const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const { test, describe, beforeEach, after } = require("node:test");
const User = require("../models/user");
const mongoose = require("mongoose");

const api = supertest(app);


describe("where registering new user fails with proper status code", () => {
    beforeEach(async() => {
        await User.deleteMany({});
    })

    test("a test fails where username is missing with status code 400", async() => {
        const newUser = {
            password: "password"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)
    })

    test("a test fails where username already exists with status code 400", async() => {
        const validUser = {
            username: "username",
            password: "password"
        }


        await new User(validUser).save();

        const usersAtStart = await User.find({});

        const withTakenUsername = {
            username: "username",
            password: "password"
        }

        const result = await api
            .post("/api/users")
            .send(withTakenUsername)
            .expect(400)
            .expect("Content-Type", /application\/json/)
        
        
        
        const usersAtEnd = await User.find({});

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
        assert(result.body.error.includes("username already taken"));
    })

    test("a test fails where username length is less than 3 with status code 400", async() => {
        const newUser = {
            username: "us",
            password: "password"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        
        assert(result.body.error.includes("invalid username. username has to be at least 3 characters long"));
    })

    test("a test fails where username is correct and password is invalid with status code 400", async() => {
        const newUser = {
            username: "username",
            password: "as"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        
        assert(result.body.error.includes("password must be at least 3 characters long"));
    })
})


after(async() => {
    await mongoose.connection.close();
})