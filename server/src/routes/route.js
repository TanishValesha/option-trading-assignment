const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');


router.get('/times', times.getTimes);
router.get('/expiry-dates', expiryDates.getExpiryDates);

module.exports = router;
