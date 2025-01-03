const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.log('Error connecting to MongoDB');

    }
}

module.exports = connectDB;
