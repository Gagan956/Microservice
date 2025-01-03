const rideModel = require('../models/rideModel'); 
const { subscribeTOQueue , publishToQueue } = require('../service/rabbit')


module.exports.createRide = async (req, res , next) => {
    try {
        const { pickup , destination } = req.body;

        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        })
        await newRide.save();

        publishToQueue("new-ride", JSON.stringify(newRide));
        res.status(201).json({
            message: 'Ride created successfully',
            ride: newRide
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
}
  
module.exports.acceptRide = async (req, res, next) => {
    try{
        const { rideId } = req.query;
        const ride = await rideModel.findById(rideId);
        if(!ride) return res.status(404).json({ message: 'Ride not found' });
        if(ride.status!== 'pending') return res.status(400).json({ message: 'Ride is not pending' });
        ride.status = 'accepted';
        await ride.save();
        subscribeTOQueue("ride-accepted", JSON.stringify(ride));
        res.status(200).json({ message: 'Ride accepted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
