const express = require('express');
require('dotenv').config();

const app = express();
const mainRoutes = require('./routes/index');

app.use(express.urlencoded({ extended: true }));
app.use('/', mainRoutes);

module.exports = app;
