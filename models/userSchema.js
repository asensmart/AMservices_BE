const mongoose = require('mongoose');

const users = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('users', users);