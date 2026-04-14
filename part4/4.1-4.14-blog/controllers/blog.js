const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get('/', async(request, response) => {
	const blogs = await Blog.find({});

	response.json(blogs);
})

blogRouter.post('/', async(request, response) => {
	const likes = request.body.likes || 0;
	
	if(!request.body.title || !request.body.url) {
		return response.status(400).end();
	}

	const blog = new Blog({ likes, ...request.body});

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
})

blogRouter.delete("/:id", async(request,response) => {
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