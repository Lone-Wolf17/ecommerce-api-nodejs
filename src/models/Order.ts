import {prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import {Types} from 'mongoose';
import { OrderItem } from './OrderItem';
import { Product } from './Product';
import { User } from './User';

export class Order {
    id!: Types.ObjectId;

    @Property({required: true, ref: () => OrderItem})
    public orderItems! : Ref<OrderItem>[];

    @Property({required: true})
    public shippingAddress1!: string;

    @Property()
    public shippingAddress2!: string;

    @Property({required: true})
    public city!: string;

    @Property({required: true})
    public zip!: string;

    @Property({required: true})
    public country!: string;

    @Property({required: true})
    public phone!: string;

    @Property({required: true, default: "Pending"})
    public status!: string;

    @Property({required: true, min: 0})
    public totalPrice!: number;

    @Property({required: true, ref: () => User})
    public user!: Ref<User>;

    // @Property({required: true, default: () => Date.now, type: () => Date})
    // public dateOrdered!: Date;

  public createdAt!: Date;
  
  }

export const OrderModel = getModelForClass(Order, {schemaOptions: {timestamps: true}});

// const OrderSchema = new mongoose.Schema({
//   orderItems: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: OrderItemModelName,
//       required: true,
//     },
//   ],
//   shippingAddress1: {
//     type: String,
//     required: true,
//   },
//   shippingAddress2: {
//     type: String,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   zip: {
//     type: String,
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//     default: "Pending",
//   },
//   totalPrice: {
//     type: Number,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: UserModelName,
//   },
//   dateOrdered: {
//     type: Date,
//     default: Date.now,
//   },
// });

// OrderSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// OrderSchema.set("toJSON", {
//   virtuals: true,
// });
