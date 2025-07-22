const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');
const optionChains = require('../controller/chainController');
const bulkData = require('../controller/bulkController');
const authController = require('../controller/authController');
const savePositionsController = require('../controller/savePositionsController');
const { authMiddleware } = require('../middlewares/authMiddlewares');



router.get('/times', authMiddleware, times.getTimes);
router.get('/expiry-dates', authMiddleware, expiryDates.getExpiryDates);
router.get('/option-chains', authMiddleware, optionChains.getOptionChains);
router.get('/bulk', authMiddleware, bulkData.getBulkData);
router.post('/user/login', authController.loginUser);
router.post('/user/register', authController.registerUser);
router.get('/user/logout', authController.logoutUser);
router.post('/positions', authMiddleware, savePositionsController.savePositions);
router.get('/positions', authMiddleware, savePositionsController.getPositions);




module.exports = router;
