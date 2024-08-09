// server/routes/footersubscribe.js
const express = require('express');
const router = express.Router();
const { FooterSubscription } = require('../models');

router.post('/subscribe', async (req, res) => {
  const { name, email } = req.body;

  // Here, handle the subscription logic (e.g., save to database)
  // For demonstration, let's assume it's always successful
  if (name && email) {
    try {
      await FooterSubscription.create({ name, email });
      res.status(200).json({ message: 'Subscription successful' });
    } catch (error) {
      res.status(500).json({ message: 'Subscription failed', error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Subscription failed' });
  }
});

module.exports = router;
