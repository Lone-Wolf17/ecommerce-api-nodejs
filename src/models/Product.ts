import {prop as Property, getModelForClass, Ref } from '@typegoose/typegoose';
import {Types} from 'mongoose';
import { Category } from './Category';

export class Product {
    id!: Types.ObjectId;

    @Property({required: true, trim: true})
  public name!: string;

  @Property({required: true})
  public description!: string;

  @Property({default: ""})
  public richDescription!: string;

  @Property({default: ""})
  public image!: string;

  @Property({type: ()=> [String]})
  public images!: string[];

  @Property({default: ""})
  public brand!: string;

  @Property({default: 0})
  public price!: number;

  @Property({ref: ()=> Category, required: true})
  public category!: Ref<Category>;

  @Property({required: true, min: 0})
  public countInStock!: number;

  @Property({ min: 0})
  public rating!: number;

  @Property({ min: 0})
  public numReviews!: number;

  @Property()
  public isFeatured!: boolean;

  @Property({ type: ()=> Date, default: () => Date.now, required: true})
  public dateCreated!: Date;
}

export const ProductModel = getModelForClass(Product);

// const ProductSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   richDescription: {
//     type: String,
//     default: "",
//   },
//   image: {
//     type: String,
//     default: "",
//   },
//   images: [String],
//   brand: {
//     type: String,
//     default: "",
//   },
//   price: {
//     type: Number,
//     default: 0,
//   },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: CategoryModelName,
//     required: true,
//   },
//   countInStock: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   rating: {
//     type: Number,
//     min: 0,
//   },
//   numReviews: {
//     type: Number,
//     min: 0,
//   },
//   isFeatured: Boolean,
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ProductSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// ProductSchema.set('toJSON', {
//   virtuals: true
// });