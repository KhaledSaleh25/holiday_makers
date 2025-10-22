const express = require('express');
const router = express.Router();

console.log("✅ productRoutes file loaded");

router.get('/', (req, res) => {
  console.log("📦 GET /api/products called");
  res.json([
    { id: 1, name: 'Tour to Giza Pyramids', price: 100 },
    { id: 2, name: 'Nile Cruise', price: 250 },
    { id: 3, name: 'Desert Safari', price: 150 }
  ]);
});

module.exports = router;
