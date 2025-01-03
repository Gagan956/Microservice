const dotenv = require('dotenv')
dotenv.config();
const userRouter = require('./routes/userRouter');
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

app.use('/', userRouter)



module.exports = app;