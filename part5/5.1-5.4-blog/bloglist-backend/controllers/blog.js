const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor, tokenExtractor } = require("../utils/middleware");

blogRouter.get('/', async(request, response) => {
	const blogs = await Blog.find({}).populate("user", "-blogs")

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

	response.status(201).json(savedBlog);
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

	return response.status(204).end();
})

blogRouter.put("/:id", async(request, response) => {
	const id = request.params.id;
	let blogToUpdate = await Blog.findById(id);

	if(!blogToUpdate) {
		return response.status(404).end();
	}

	if(!request.body || !request.body.likes) {
		return response.status(400).end();
	}

	const updatedLikes = request.body.likes;

	blogToUpdate.likes = updatedLikes;

	const updatedBlog = await blogToUpdate.save();

	return response.json(updatedBlog);
})

module.exports = blogRouter;