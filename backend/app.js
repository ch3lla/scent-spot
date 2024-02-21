require('dotenv').config();
const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const db = require('./config/db');

const apiRoutes = require('./routes/index');

const app = express();
// connecting database
db();

// middlewares
app.use(cors());
app.options(`${process.env.FRONTEND_URL}`, cors()); // * will be changed to specified url later on
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Serever is running on localhost:${process.env.PORT}`);
});
