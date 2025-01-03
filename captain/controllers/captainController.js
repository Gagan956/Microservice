const captainModel = require('../models/captainModel');
const blacklisttokenModel = require('../models/blacklisttokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { subscribeTOQueue} = require('../service/rabbit');

const pendingRequests = [];

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const captain = await captainModel.findOne({ email });
        if (captain) {
            return res.status(400).json({ message: 'captain already exists' });
        }
        const hash = await bcrypt.hash(password, 10);

        const newcaptain = new captainModel({ name, email, password: hash });
        await newcaptain.save();        

        const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET);
        res.cookie('token', token,);
        delete newcaptain._doc.password;

        res.status(201).json({token , newcaptain});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }
        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }

        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);
        res.cookie('token', token,);
        
        delete captain._doc.password;
        res.status(201).json({token , captain});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }

}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.captain)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id)
        captain.isAvailable = !captain.isAvailable;
            await captain.save();
            res.status(200).json({ captain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.waitForNewRide = async (req, res) => {
    //set timeout fot long polling e.g -> 30 seconds
    req.setTimeout(30000, () =>{
        res.status(204).end(); // No content
    });

    // Add the response object to the pendingRequests array
      pendingRequests.push(res);
};

subscribeTOQueue("new-ride",(data) =>{
   const rideData = JSON.parse(data);

   //send the new ride data to all pending request 
   pendingRequests.forEach(res => {
    res.json({data: rideData})
   })
   //clear the pending request 
   pendingRequests.length = 0;

});
