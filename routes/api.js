var express = require('express');
var router = express.Router();

router.use('/users', require('./user'));
router.use('/models', require('./models'));
router.use('/quotes', require('./quotes'));
router.use('/inbox', require('./messages'));
router.use('/devicetypes', require('./devicetypes'));
router.use('/devices', require('./devices'));
router.use('/capacities', require('./capacities'));
router.use('/mail', require('./mail'));
router.use('/brands', require('./brands'));
module.exports = router;
