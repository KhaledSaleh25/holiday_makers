const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

const router = express.Router();

router.get('/', protect, getReservations);
router.get('/:id', protect, getReservation);
router.post('/', protect, createReservation);
router.put('/:id', protect, updateReservation);
router.delete('/:id', protect, deleteReservation);

module.exports = router;