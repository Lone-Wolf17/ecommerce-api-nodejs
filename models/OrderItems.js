const mongoose = require('mongoose');
const { ProductModelName, OrderItemModelName } = require('../constants/modelNames');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ProductModelName
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model(OrderItemModelName, OrderItemSchema);
