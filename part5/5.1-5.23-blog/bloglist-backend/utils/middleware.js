const jwt = require("jsonwebtoken");

const tokenExtractor = (request, response, next) => {
    // token auth
    const token = request.get("authorization");

    if(!token || !token.startsWith("Bearer ")) {
        return response.status(401).json({ error: "invalid token" });
    }

    const tokenExtracted = token.replace("Bearer ", "");

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