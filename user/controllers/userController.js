const userModel = require('../models/userModel');
const blacklisttokenModel = require('../models/blacklisttokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hash = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hash });
        await newUser.save();        

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.cookie('token', token,);
        delete newUser._doc.password;

        res.status(201).json({token , newUser});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token,);
        
        delete user._doc.password;
        res.status(201).json({token , user});
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
        res.send(req.user)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.acceptedRide = async (req, res) => {
    
}