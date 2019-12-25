const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET = process.env.JWT_KEY

module.exports = {
    validateToken: (req, res, next) => {
        if (!req.headers["x-access-token"] || !req.headers.authorization){
            return res.status(401).end()
        }
        const token = req.headers["x-access-token"] || req.headers.authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                auth: false,
                message: "Access denied. No token provided."
            })
        }
        options = {
            issuer: "workhome",
            expiresIn: "1d"
        };
        jwt.verify(token, SECRET, options, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
            }
            // return res.status(200).send(decoded);
            // console.log(decoded);
            req.decoded = decoded;
            next()

        });
    }
}
