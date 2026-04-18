const config = require("./utils/config");
const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const { tokenExtractor, userExtractor } = require("./utils/middleware"); 

const app = express();



const mongoUrl = config.MONGODB_URI;
console.log("connecting to: ", mongoUrl);
mongoose.connect(mongoUrl, { family: 4 })
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch(error => {
        console.log("error connecting to mongodb: " + error.message);
    })


app.use(express.json());

app.use(tokenExtractor);
app.use("/api/blogs", userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);


app.use((error, request, response, next) => {
    // console.log(error, "err");
    // console.log(error.name, "err NAME");
    // console.log(error.message, " err MESSAGE");

    if(error.name === "ValidationError" && error.message.includes("User validation failed: username: Path `username`")) {
        return response.status(400).json({ error: "invalid username. username has to be at least 3 characters long"})
    } else if(error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error collection:")) {
        return response.status(400).json({ error: "username already taken" });
    } else if(error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "invalid token" });
    }

    next();
})

module.exports = app;