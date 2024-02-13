const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({error: "No Token, please login."});
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({error: "Invalid Token."});
        } else {
            req.user = user;
            next(); // Call next() here
        }
    });
};


const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(req.user._id, req.params.id, req.user.isAdmin);
        if(req.user._id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next()
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }