import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config(); // Load Config

import connectDB  from './util/db';
import authJwt from './helpers/jwt';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import ordersRouter from './routes/orders';
import usersRouter from './routes/users';
import errorHandler from './helpers/error-handler';



const app = express();

const corsOptions: cors.CorsOptions = {
  origin: [
    '*'
  ]
};
app.use(cors(corsOptions));

const api = process.env.API_BASE_URL;

// Middleware
app.use(express.urlencoded({ extended: false })); // body parser
app.use(express.json()); // body parser
app.use(morgan("tiny"));
app.use(authJwt);
app.use(`${api}/images`,  express.static(path.join(__dirname, "..", "images"))); // static folder

// Connect to Mongo DB
connectDB();

// Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
