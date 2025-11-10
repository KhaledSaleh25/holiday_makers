const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  exportToExcel,
  importFromExcel,
  getSupplierStats
} = require('../controllers/supplierController');

const router = express.Router();

// Basic CRUD operations
router.get('/', protect, getSuppliers);
router.get('/:id', protect, getSupplier);
router.post('/', protect, createSupplier);
router.put('/:id', protect, updateSupplier);
router.delete('/:id', protect, deleteSupplier);

// Export/Import operations
router.get('/export/excel', protect, exportToExcel);
router.post('/import/excel', protect, importFromExcel);

// Statistics
router.get('/stats/overview', protect, getSupplierStats);

module.exports = router;