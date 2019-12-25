const express = require('express')
var jwt = require('jsonwebtoken');

const User = require("../models/user")
const auth = require("../auth/auth").validateToken;
const router = express.Router()


const SECRET = process.env.JWT_KEY

router.get('/', auth, (req, res) => {
    // console.log(req.decoded)
    const payload = req.decoded;
    if (payload && payload.isAdmin === true) {
        User.find({},(err,users)=>{
            if (err) return res.status(400)
            return res.status(200).json(users)
        }).lean()
        
    } else {
        return res.status(500).json({
            message: err.message
        })
    }
});
router.get('/profile', auth, (req, res, next) => {
    // console.log(req.decoded)
    const payload = req.decoded;
    User.findById(payload.id, {
            password: 0
        },
        (err, user) => {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            // res.status(200).send(user);
            next(user);
        })
})

router.post('/register', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        bio: req.body.bio,
        isAdmin: false

    }, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: err.message
            })
        }
        let token = user.generateAuthToken(user);
        return res.status(200).header("x-access-token", token).json({
            id: user._id,
            auth: true,
            token: token,
            isAdmin: user.isAdmin
        })
    })
});

router.post('/login', (req, res, next) => {
    User.findOne({
        'email': req.body.email
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        if (!user) {
            return res.status(404).json({
                message: 'Login failed, user not found'
            })
        }
        user.comparePassword(req.body.password, (error, isMatch) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                });
            }
            if (!isMatch) {
                return res.status(401).json({
                    message: 'Wrong Password'
                });
            }
            const token = user.generateAuthToken(user);
            // console.log("token: ", token)
            return res.status(200).header("x-access-token", token).send({
                id: user._id,
                auth: true,
                token: token,
                isAdmin: user.isAdmin
            });
        });

    })
});
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
});

router.patch('/:id', getUser, (req, res) => {
    if (req.body.password != null) {
        res.user.password = req.body.password
    }
    res.user.save((err, response) => {
        if (err) {
            res.status(400).json({
                message: err.message
            })
        }
        res.status(201).json(response)
    })
});

router.delete('/:id', getUser, (req, res) => {
    res.user.remove((err) => {
        res.status(400).json({
            message: err.message
        });
    })
    res.json({
        message: 'User deleted'
    })
});

router.get('/logout', function (req, res) {
    res.status(200).send({
        auth: false,
        token: null
    });
});

router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

function getUser(req, res, next) {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            res.status(400).json({
                message: err.message
            });
        }
        if (user == null) {
            return res.status(404).json({
                message: "Can't find user"
            })
        }
        res.user = user
        next()
    });
}
module.exports = router
