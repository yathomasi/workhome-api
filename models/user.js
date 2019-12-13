const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
let SALT = 14

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});
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
