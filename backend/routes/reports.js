const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getStatistics,
  getReservationReports
} = require('../controllers/reportController');

const router = express.Router();

router.get('/statistics', protect, getStatistics);
router.get('/reservations', protect, getReservationReports);

module.exports = router;