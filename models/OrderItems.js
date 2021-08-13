const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({

});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
