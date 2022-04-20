import {Router} from 'express'

import * as UserController from '../controllers/user';

const router = Router();

// @desc        Retrieve all users
// @route       Get api/v1/users/
router.get("/", UserController.getAllUsers);

// @desc        Retrieve a particular User using its id
// @route       Get api/v1/users/:id
router.get("/:id", UserController.getUserById);

// @desc        Create a new User
// @route       Post api/v1/users
router.post("/", UserController.createUser);

// @desc        Login User
// @route       Post api/v1/users/login
router.post("/login", UserController.logIn);


// @desc        register a User
// @route       Post api/v1/users/register
/// This is technically a twin to POST api/v1/users/
/// This is for regular users, that one is expected to be used by Admins Panel
router.post("/register", UserController.signUp);

// @desc        Get Count of User in DB
// @route       Get api/v1/users/get/count
router.get("/get/count", UserController.getUserCount);

// @desc        Delete a User
// @route       Delete api/v1/user/:id
router.delete("/:id", UserController.deleteUser);


export default router;
