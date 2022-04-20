import {prop as Property, getModelForClass } from '@typegoose/typegoose';
import {Types} from 'mongoose';

export class User {
  id!: Types.ObjectId;

  @Property({required: true})
  public name!: string;

  @Property({required: true})
  public email!: string;
  
  @Property({required: true})
  public passwordHash!: string;

  @Property({required: true})
  public phone!: string;

  @Property({default: false, required: true})
  public isAdmin!: boolean;

  @Property({default: ""})
  public street!: string;

  @Property({default: ""})
  public apartment!: string;

  @Property({default: ""})
  public city!: string;

  @Property({default: ""})
  public zip!: string;

  @Property({default: ""})
  public country!: string;
}
export const UserModel = getModelForClass(User);
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   passwordHash: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   street: {
//     type: String,
//     default: "",
//   },
//   apartment: {
//     type: String,
//     default: "",
//   },
//   city: {
//     type: String,
//     default: "",
//   },
//   zip: {
//     type: String,
//     default: "",
//   },
//   country: {
//     type: String,
//     default: "",
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
// });

// UserSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// UserSchema.set("toJSON", {
//   virtuals: true,
// });

// module.exports = mongoose.model(UserModelName, UserSchema);
