const express = require('express');
require('dotenv').config();

const app = express();
const mainRoutes = require('./routes/index');

app.use('/', mainRoutes);

module.exports = app;