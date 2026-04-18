const jwt = require("jsonwebtoken");

const tokenExtractor = (request, response, next) => {
    // token auth
    const token = request.get("authorization");

    const tokenExtracted = token && token.replace("Bearer ", "");

    request.token = tokenExtracted;

    next();
}

const userExtractor = (request, response, next) => {
    if(request.token) {
        request.user = jwt.verify(request.token, process.env.SECRET);
    }

    next();
}

module.exports = {
    tokenExtractor,
    userExtractor
}