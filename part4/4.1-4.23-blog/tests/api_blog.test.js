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
    const newBlog = {
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

test("a new blog without likes property", async() => {
    const blogWithoutLikes ={
        title: "blog title without likes prop",
        author: "blog author without likes prop",
        url: "blog url without likes prop",
    }

    const response = await api
        .post("/api/blogs")
        .send(blogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    
    assert.strictEqual(response.body.likes, 0);
})

test("a new blog without title property", async() => {
    const blogWithoutTitle = {
        author: "blog author without title prop",
        url: "blog url without title prop",
        likes: 5
    }

    const response = await api
        .post("/api/blogs")
        .send(blogWithoutTitle)
        .expect(400)
})

test("a new blog without url property", async() => {
    const blogWithoutUrl = {
        author: "blog author without url prop",
        title: "blog title without url prop",
        likes: 1
    }

    const response = await api
        .post("/api/blogs")
        .send(blogWithoutUrl)
        .expect(400)
})

test("a blog is deleted with valid id", async() => {
    const blogs = await Blog.find({});
    const blog = blogs[0].toJSON();
    
    const { id } = blog;

    const reponse = await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

})

test("a blog deletion fails with status 404 if blog does not exist", async() => {
    const blog = new Blog({
        title: "title",
        url: "url",
    })

    const createdBlog = await blog.save();
    const id = createdBlog._id.toString();
    await Blog.findByIdAndDelete(id);

    const response = await api
        .delete(`/api/blogs/${id}`)
        .expect(404)
})

test("a blog is updated with valid id and valid likes property", async() => {
    const blogs = await Blog.find({});
    const id = blogs[0].toJSON().id;

    const updatedLikes = 100;

    const response = await api
        .put(`/api/blogs/${id}`)
        .send({ likes: updatedLikes })
        .expect(200)

    const updatedBlog = await Blog.findById(id);

    assert.strictEqual(updatedBlog.likes, 100);
})

test("a blog update fails with status 404 if blog does not exist", async() => {
    const blog = new Blog({
        title: "title",
        url: "url",
    })

    const createdBlog = await blog.save();
    const id = createdBlog._id.toString();
    await Blog.findByIdAndDelete(id);

    const response = await api
        .put(`/api/blogs/${id}`)
        .send({ likes: 5 })
        .expect(404)
})

test("a blog update fails with status 400 if likes property is missing", async() => {
    const blogs = await Blog.find({});
    const id = blogs[0].toJSON().id;


    const response = await api
        .put(`/api/blogs/${id}`)
        .send({})
        .expect(400)
})

after(() => {
    mongoose.connection.close();
})