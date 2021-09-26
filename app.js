const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db.js");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" }); // Load Config
const authJwt = require("./helpers/jwt.js");
const productsRouter = require("./routes/products.js");
const categoriesRouter = require("./routes/categories.js");
const ordersRouter = require("./routes/orders.js");
const usersRouter = require("./routes/users.js");
const errorHandler = require("./helpers/error-handler.js");

const app = express();
app.use(cors());
app.options("*", cors());
const api = process.env.API_BASE_URL;

// Middleware
app.use(express.urlencoded({ extended: false })); // body parser
app.use(express.json()); // body parser
app.use(morgan("tiny"));
app.use(authJwt);
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads")); // static folder

// Connect to Mongo DB
connectDB();

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
