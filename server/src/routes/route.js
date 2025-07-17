const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');
const optionChains = require('../controller/chainController');
const bulkData = require('../controller/bulkController');



router.get('/times', times.getTimes);
router.get('/expiry-dates', expiryDates.getExpiryDates);
router.get('/option-chains', optionChains.getOptionChains);
router.get('/bulk', bulkData.getBulkData);

module.exports = router;
