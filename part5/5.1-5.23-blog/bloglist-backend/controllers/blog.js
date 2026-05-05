const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor, tokenExtractor } = require("../utils/middleware");

blogRouter.get('/', async(request, response) => {
	const blogs = await Blog.find({}).populate("user", "-blogs");

	response.json(blogs);
})

blogRouter.post('/', tokenExtractor, userExtractor, async(request, response, next) => {
	const likes = request.body.likes || 0;
	
	if(!request.body.title || !request.body.url) {
		return response.status(400).end();
	}

	// token auth
	const decodedUser = request.user;

	const user = await User.findById(decodedUser.id);

	// blog creation
	const blog = new Blog({ likes, ...request.body, user: user.id});
	user.blogs = user.blogs.concat(blog._id);

	const savedBlog = await blog.save();
	const savedUser = await user.save();

	const populatedBlog = await savedBlog.populate("user", -"blogs");

	response.status(201).json(populatedBlog);
})

blogRouter.delete("/:id", tokenExtractor, userExtractor, async(request,response) => {

	const decodedUser = request.user;

	const user = await User.findById(decodedUser.id);
	const blog = await Blog.findById(request.params.id);

	if(user._id.toString() !== blog.user.toString()) {
		return response.status(403).json({ error: "not authorized" });
	}

	const id = request.params.id;
	const deletedBlog = await Blog.findByIdAndDelete(id);

	if(!deletedBlog) {
		return response.status(404).end();
	}

	// delete blog id from users blogs
	user.blogs = user.blogs.filter(blogId => blogId !== id);
	await user.save();

	return response.status(204).end();
})

blogRouter.put("/:id", async(request, response) => {
	const { title, author, url, likes } = request.body;

	const id = request.params.id;
	let blogToUpdate = await Blog.findById(id);

	if(!blogToUpdate) {
		return response.status(404).end();
	}

	if(!request.body || !request.body.likes || !request.body.title || !request.body.author || !request.body.url) {
		console.log(request.body);
		return response.status(400).end();
	}

	blogToUpdate.likes = likes;
	blogToUpdate.title = title;
	blogToUpdate.author = author;
	blogToUpdate.url = url;

	const updatedBlog = await blogToUpdate.save();
	const updatedBlogWithUser = await updatedBlog.populate("user", "-blogs");

	return response.json(updatedBlogWithUser);
})

module.exports = blogRouter;