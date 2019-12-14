const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')
let SALT = 14

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "username can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'username is invalid'],
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "email can't be blank"],
        match: [/\S+@\S+\.\S+/, 'email is invalid'],
        unique: true,
        index: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    bio: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    isAdmin: Boolean

}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator, {
    message: 'is already taken.'
})

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }

});

userSchema.methods.comparePassword = function (pass, checkpass) {
    bcrypt.compare(pass, this.password, (err, isMatch) => {
        if (err) {
            return checkpass(err, null)
        }
        return checkpass(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)
