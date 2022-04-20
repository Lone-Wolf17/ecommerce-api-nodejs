import { Response, NextFunction } from "express";
import { CustomRequestObject } from "../models/custom-request-object";
import bcrypt from 'bcryptjs';
import {isValidObjectId} from 'mongoose';
import jwt from 'jsonwebtoken';

import { UserModel } from "../models/User";

const salt = bcrypt.genSaltSync(7);

export const getAllUsers = async (req: CustomRequestObject, res: Response) => {
    try {
        const userList = await UserModel.find().select("-passwordHash");
    
        if (!userList) {
          res.status(400).json({ success: false });
        }
        res.send(userList);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }
}

export const getUserById = async (req: CustomRequestObject, res: Response) => {
    try {
        console.log("Point A");
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid User ID",
          });
        console.log("Point B");
        const user = await UserModel.findById(req.params.id).select("-passwordHash");
        console.log("Point C");
        if (!user)
          res.status(404).json({
            success: false,
            message: "The User with the given ID was not found!!!",
          });
    
        res.status(200).send(user);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

// Used by admins
export const createUser = async (req: CustomRequestObject, res: Response) => {
    try {
        const user = await UserModel.create({
          name: req.body.name,
          email: req.body.email,
          passwordHash: bcrypt.hashSync(req.body.password, salt),
          phone: req.body.phone,
          isAdmin: req.body.isAdmin,
          apartment: req.body.apartment,
          street: req.body.street,
          zip: req.body.zip,
          city: req.body.city,
          country: req.body.country,
        });
    
        // user = await user.save();
    
        if (!user)
          return res.status(404).json({
            message: "The User Could not be created",
            success: false,
          });
    
        res.status(200).send(user);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const logIn = async (req: CustomRequestObject, res: Response) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        const secret = process.env.JWT_SECRET!;
    
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "The User Not Found",
          });
        }
    
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
          const token = jwt.sign(
            {
              userId: user.id,
              isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: "1d" }
          );
    
          return res.status(200).send({ user: user.email, token: token });
        } else {
          return res.status(400).send("Password is wrong");
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err,
        });
      }
}

// Used by Users
export const signUp = async (req: CustomRequestObject, res: Response) => {
    try {
        const user = await UserModel.create({
          name: req.body.name,
          email: req.body.email,
          passwordHash: bcrypt.hashSync(req.body.password, salt),
          phone: req.body.phone,
          isAdmin: req.body.isAdmin,
          apartment: req.body.apartment,
          street: req.body.street,
          zip: req.body.zip,
          city: req.body.city,
          country: req.body.country,
        });
    
        // user = await user.save();
    
        if (!user)
          return res.status(404).json({
            message: "The User Could not be created",
            success: false,
          });
    
        res.status(200).send(user);
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const getUserCount = async (req: CustomRequestObject, res: Response) => {
    try {
        const userCount = await UserModel.countDocuments((count) => count);
    
        if (!userCount) return res.status(400).json({ success: false });
    
        res.status(200).send({
          userCount: userCount,
        });
      } catch (err) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }
}

export const deleteUser = async (req: CustomRequestObject, res: Response, next: NextFunction) => {
    try {
        /// Checks if id is a valid Object ID
        if (!isValidObjectId(req.params.id))
          return res.status(400).json({
            success: false,
            message: "Invalid User ID",
          });
    
        /// Checks if prodduect exists in DB
        const user = await UserModel.findById(req.params.id);
        if (!user)
          return res.status(400).json({
            success: false,
            message: "User to be Deleted was not found in Database",
          });
    
        // This is the line that does the deleting from DB
        const result = await UserModel.findByIdAndRemove(req.params.id);
    
        if (!result)
          return res.status(404).json({
            message: "User not Found in DB",
            success: false,
          });
    
        return res
          .status(200)
          .json({ success: true, message: "The User was deleted" });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: err,
          success: false,
        });
    
        next(err);
      }
}
