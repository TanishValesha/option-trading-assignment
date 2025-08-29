const router = require('express').Router();
const times  = require('../controller/timesController');
const expiryDates = require('../controller/expiresController');
const optionChains = require('../controller/chainController');
const bulkData = require('../controller/bulkController');
const authController = require('../controller/authController');
const savePositionsController = require('../controller/savePositionsController');
const watchlistController = require('../controller/watchlistController');
const { authMiddleware } = require('../middlewares/authMiddlewares');
const { getStockList, getStockData } = require('../controller/stockController');


// OLD ROUTES
router.get('/times', authMiddleware, times.getTimes);
router.get('/expiry-dates', authMiddleware, expiryDates.getExpiryDates);
router.get('/option-chains', authMiddleware, optionChains.getOptionChains);
router.get('/bulk', authMiddleware, bulkData.getBulkData);
router.post('/user/login', authController.loginUser);
router.post('/user/register', authController.registerUser);
router.get('/user/logout', authController.logoutUser);
router.post('/positions', authMiddleware, savePositionsController.savePositions);
router.get('/positions', authMiddleware, savePositionsController.getPositions);


// STOCK ROUTES
router.get('/stocks', getStockList);
router.get('/stocks/:ticker', getStockData);


// WATCHLIST ROUTES
router.get('/watchlist/get', authMiddleware, watchlistController.getWatchlist);
router.post('/watchlist/add', authMiddleware, watchlistController.addToWatchlist);
router.post('/watchlist/delete', authMiddleware, watchlistController.deleteFromWatchlist);
router.get('/watchlist/today/:ticker', authMiddleware, watchlistController.getTodayStockData);




module.exports = router;
