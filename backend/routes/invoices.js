const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for invoice routes
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Invoices route working'
  });
});

module.exports = router;