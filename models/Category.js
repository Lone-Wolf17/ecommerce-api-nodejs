const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    },
    color: String, // stores hex string eg #0000 for black
    icon: String,
    image: String
});

module.exports = mongoose.model('Category', CategorySchema);