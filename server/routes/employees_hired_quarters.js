const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

router.get('/employees-hired-quarters', (req, res) => {
  Employee.getHiredByQuarter2021((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
