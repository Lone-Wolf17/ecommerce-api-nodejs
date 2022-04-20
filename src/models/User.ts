import {prop as Property, getModelForClass } from '@typegoose/typegoose';
import {Types} from 'mongoose';

export class User {
  id!: Types.ObjectId;

  @Property({required: true})
  public name!: string;

  @Property({required: true, unique: true})
  public email!: string;
  
  @Property({required: true})
  public passwordHash!: string;

  @Property({required: true, unique: true})
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