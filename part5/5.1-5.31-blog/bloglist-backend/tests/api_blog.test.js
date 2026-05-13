const { test, after, beforeEach } = require("node:test");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const assert = require("node:assert");
const api = supertest(app);


const initialUser = {
    username: "user",
    password: "password"
}

const initialBlogs = [
    {
        title: "initial title 1",
        author: "initial author 1",
        url: "initial url 1",
        likes: 1
    },
    {
        title: "initial title 2",
        author: "initial author 2",
        url: "initial url 2",
        likes: 2
    }
]

beforeEach(async() => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash(initialUser.password, 10);
    
    const newUser = {
        ...initialUser,
        password: hashedPassword
    }
    const user = new User(newUser);

    const blog1 = new Blog(initialBlogs[0]);
    const blog2 = new Blog(initialBlogs[1]);

    user.blogs = user.blogs.concat(blog1._id, blog2._id);
    blog1.user = user._id;
    blog2.user = user._id;

    await user.save();
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
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const newBlog = {
        title: "new title",
        author: "new author",
        url: "new url",
        likes: 1
    }

    const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);


    const blogsAtTheEnd = await Blog.find({});
    const titles = blogsAtTheEnd.map(b => b.title);

    assert(titles.includes("new title"));
    assert.strictEqual(blogsAtTheEnd.length, initialBlogs.length + 1);
})

test("a new blog creation fails with invalid token unauthorized status code 401", async() => {
    const newBlog = {
        title: "new title",
        author: "new author",
        url: "new url",
        likes: 1
    }

    const response = await api
        .post("/api/blogs")
        .set("Authorization", "invalidtoken")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("invalid token"));
})

test("a new blog without likes property", async() => {
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blogWithoutLikes ={
        title: "blog title without likes prop",
        author: "blog author without likes prop",
        url: "blog url without likes prop",
    }

    const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .send(blogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    
    assert.strictEqual(response.body.likes, 0);
})

test("a new blog without title property", async() => {
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blogWithoutTitle = {
        author: "blog author without title prop",
        url: "blog url without title prop",
        likes: 5
    }

    const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .send(blogWithoutTitle)
        .expect(400)
})

test("a new blog without url property", async() => {
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blogWithoutUrl = {
        author: "blog author without url prop",
        title: "blog title without url prop",
        likes: 1
    }

    const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .send(blogWithoutUrl)
        .expect(400)
})

test("a blog is deleted with valid id", async() => {
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blogs = await Blog.find({});
    const blog = blogs[0].toJSON();
    
    const { id } = blog;

    const reponse = await api
        .delete(`/api/blogs/${id}`)
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .expect(204)

})

test("a blog deletion fails with status 404 if blog does not exist", async() => {
    const user = await User.findOne({ username: "user" });

    const loginInfo = {
        ...initialUser
    }

    const loginResponse = await api
        .post("/login")
        .send(loginInfo)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blog = new Blog({
        title: "title",
        url: "url",
    })

    const createdBlog = await blog.save();
    const id = createdBlog._id.toString();
    await Blog.findByIdAndDelete(id);

    const response = await api
        .delete(`/api/blogs/${id}`)
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
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