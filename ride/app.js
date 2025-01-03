const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db')
connectDB();
const app = express();
const rideRouter = require('./routes/rideRouter')
const rabbitMQ = require('./service/rabbit')

rabbitMQ.connect()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', rideRouter)


module.exports = app;