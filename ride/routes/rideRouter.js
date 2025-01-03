const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController')
const authMiddleware = require('../middlware/authMiddleware')

router.post('/create-ride', authMiddleware.userAuth , rideController.createRide );
router.put('/accept-ride', authMiddleware.captainAuth, rideController.acceptRide )

module.exports = router;