const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    captain: {
        type: mongoose.Schema.Types.ObjectId,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed','started' ,'cancelled', 'requested'],
        default: 'requested',
    },

}, {timestamps: true})


module.exports = mongoose.model('Ride', rideSchema);