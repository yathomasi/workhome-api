const jwt = require('jsonwebtoken');
require("dotenv").config();

const SECRET = process.env.JWT_KEY

module.exports = {
    validateToken: (req, res, next) => {
        const token = req.headers["x-access-token"] || req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({
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
                return res.status(500).send({
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
