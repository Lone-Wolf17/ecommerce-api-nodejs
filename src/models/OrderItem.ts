import {prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import {Types} from 'mongoose';
import { Product } from './Product';

export class OrderItem {
    id!: Types.ObjectId;
    
    @Property({ref: () => Product})
    product: Ref<Product>;

    @Property({required: true, min: 0})
    public quantity!: number
}

export const OrderItemModel = getModelForClass(OrderItem);

// const OrderItemSchema = new mongoose.Schema({
//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: ProductModelName
//     },
//     quantity: {
//         type: Number,
//         required: true
//     }
// });
