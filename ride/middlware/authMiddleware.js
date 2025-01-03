const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
        // fetch user data from the API
        const response = await axios.get(`${process.env.BASE_URL}/user/profile`, // communicate these said its a synchronous communication
          {  headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        const user = response.data;

        if(!user){
            return res.status(401).json({message: 'Unauthorized'});
        }
        
       console.log(req.user);

        req.user = user;
        
        next();
            
    } catch (error) {
        res.status(401).json({message: error.message});
        
    }
}

module.exports.captainAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // fetch captain data from the API
        const response = await axios.get(`${process.env.BASE_URL}/captain/profile`, // communicate these said its a synchronous communication
          {  headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        const captain = response.data;

        if(!captain){
            return res.status(401).json({message: 'Unauthorized'});
        }
        
        req.captain = captain;
        
        next();
    } catch (error) {
        res.status(401).json({message: error.message});
    }
}