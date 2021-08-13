const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    street: String,
    apartment: String,
    city: String,
    zip: String,
    country: Number,
    isAdmin : {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);