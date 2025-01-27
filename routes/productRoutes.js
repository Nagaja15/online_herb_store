const express = require('express');
const router = express.Router();

// Sample route for products
router.get('/', (req, res) => {
  res.send('Welcome to the Products API');
});

// Add more routes here
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`Details for product ID: ${productId}`);
});

module.exports = router;
