require("dotenv").config();
const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoute = require('./controllers/auth');
const userRoute = require('./controllers/users.controllers');
const productRoute = require('./controllers/product.controller');
const cartRoute = require('./controllers/cart.controller');

const app = express();
//connecting database
db();

//middlewares
app.use(cors());
app.options(`${process.env.BASE_URL}`, cors()); // * will be changed to specified url later on
app.use(json());
app.use(urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);


app.listen(process.env.PORT, () => {
  console.log(`Serever is running on localhost:${process.env.PORT}`);
});
