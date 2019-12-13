const express = require('express')
const router = express.Router()
const User = require("../models/user")

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});

router.post('/register', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    }).save((err, response) => {
        if (err) {
            res.status(400).json({
                message: err.message
            })
        }
        res.status(201).json(response)
    })
});

router.post('/login', (req, res, next) => {
    User.findOne({
        'email': req.body.email
    }, (err, user) => {
        if (err) {
            res.status(400).json({
                message: err.message
            });
        }
        if (!user) {
            res.json({
                message: 'Login failed, user not found'
            })
            return next()
        }
        user.comparePassword(req.body.password, (error, isMatch) => {
            if (error) {
                res.status(400).json({
                    message: error.message
                });
            }
            if (!isMatch) {
                res.status(400).json({
                    message: 'Wrong Password'
                });
                return next()
            }
            res.status(200).send('Logged in');
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
