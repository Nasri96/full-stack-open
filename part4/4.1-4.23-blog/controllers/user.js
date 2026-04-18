const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

userRouter.get("/", async(request, response, next) => {
    const users = await User.find({}).populate("blogs", "-user");

    return response.json(users);
})

userRouter.post("/", async(request, response, next) => {
    const { name, username, password } = request.body;

    if(!password || password.length < 3) {
        return response.status(400).json({ error: "password must be at least 3 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        username,
        password: passwordHashed
    })

    const createdUser = await newUser.save();

    return response.status(201).json(createdUser);

})

module.exports = userRouter;