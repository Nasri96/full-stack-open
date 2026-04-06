const config = require("./utils/config");
const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require("./controllers/blog");

const app = express();



const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 })
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch(error => {
        console.log("error connecting to mongodb: " + error.message);
    })


app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;