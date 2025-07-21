const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');
const optionChains = require('../controller/chainController');
const bulkData = require('../controller/bulkController');
const authController = require('../controller/authController');



router.get('/times', times.getTimes);
router.get('/expiry-dates', expiryDates.getExpiryDates);
router.get('/option-chains', optionChains.getOptionChains);
router.get('/bulk', bulkData.getBulkData);
router.post('/user/login', authController.loginUser);
router.post('/user/register', authController.registerUser);
router.get('/user/logout', authController.logoutUser);


module.exports = router;
