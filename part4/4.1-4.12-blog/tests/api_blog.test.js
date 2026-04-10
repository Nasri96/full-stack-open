const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const assert = require("node:assert");
const api = supertest(app);



const initialBlogs = [
    {
        title: "testtitle",
        author: "testauthor",
        url: "testurl",
        likes: 1
    },
    {
        title: "another title",
        author: "another author",
        url: "another url",
        likes: 10
    }
    
]

beforeEach(async() => {
    await Blog.deleteMany({})

    const blog1 = new Blog(initialBlogs[0]);
    const blog2 = new Blog(initialBlogs[1]);

    await blog1.save();
    await blog2.save();
})


test("all blogs are returned", async() => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    
    assert.strictEqual(response.body.length, initialBlogs.length);
})

test("blogs have property id", async() => {
    const blogs = await Blog.find({});
    
    const keys = Object.keys(blogs[0].toJSON());

    assert(keys.includes("id"));
})

test("a new blog can be added", async() => {
    const newBlog ={
        title: "testing title",
        author: "testing author",
        url: "testing url",
        likes: 1
    }

    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtTheEnd = await Blog.find({});
    const titles = blogsAtTheEnd.map(b => b.title);

    assert(titles.includes("testing title"));
    assert.strictEqual(blogsAtTheEnd.length, initialBlogs.length + 1);
})

after(() => {
    mongoose.connection.close();
})