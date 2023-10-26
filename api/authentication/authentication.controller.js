const jwt = require("jsonwebtoken");
require("dotenv").config()

const authenticate = (req, res, next) => {
    const token = req.authorization.split(" ")[1];
    try {
        const isValidToken = jwt.verify(token, process.env.SECRTE_KEY);
        next();
    } catch {
        res.status(401).json({ "message": "not a valid toke. " });
    }
    next()
}


module.exports = { authenticate };