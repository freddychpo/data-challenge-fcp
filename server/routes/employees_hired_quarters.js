const express = require('express');
const router = express.Router();
const HiredEmployees = require('../models/hired_employees');

router.get('/employees-hired-quarters', (req, res) => {
  HiredEmployees.getHiredByQuarter2021((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
