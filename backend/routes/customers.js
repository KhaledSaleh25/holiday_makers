const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  advancedSearch
} = require('../controllers/customerController');

const router = express.Router();

// Basic CRUD operations
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomer);
router.post('/', protect, createCustomer);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, deleteCustomer);

// Additional features
router.get('/stats/overview', protect, getCustomerStats);
router.get('/search/advanced', protect, advancedSearch);

module.exports = router;