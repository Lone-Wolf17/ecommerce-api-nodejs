import {prop as Property, getModelForClass } from '@typegoose/typegoose';
import {Types} from 'mongoose';

export class Category {
  public id!: Types.ObjectId;

  @Property({required: true})
  public name!: string;

  @Property()
  public color!: string; // stores hex string eg #0000 for black

  @Property()
  public icon!: string;

  @Property()
  public imageurl!: string
}

export const CategoryModel = getModelForClass(Category);

// const CategorySchema = new mongoose.Schema({
//   id: String,
//   name: {
//     type: String,
//     required: true,
//   },
//   color: String, // stores hex string eg #0000 for black
//   icon: String,
//   image: String,
// });

// module.exports = mongoose.model(CategoryModelName, CategorySchema);
