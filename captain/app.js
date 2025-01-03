const dotenv = require('dotenv')
dotenv.config();
const captainRouter = require('./routes/captainRouter');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const connectDB = require('./db/db');
connectDB();
const rabbitMQ = require('./service/rabbit')
rabbitMQ.connect()



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/', captainRouter)



module.exports = app;