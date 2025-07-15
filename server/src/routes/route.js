const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');
const optionChains = require('../controller/chainController');


router.get('/times', times.getTimes);
router.get('/expiry-dates', expiryDates.getExpiryDates);
router.get('/option-chains', optionChains.getOptionChains);

module.exports = router;
