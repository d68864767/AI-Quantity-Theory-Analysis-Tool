// reporting.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the data model
const DataModel = mongoose.model('Data');

// Route to generate report
router.get('/report', async (req, res) => {
  try {
    // Fetch all data from the database
    const data = await DataModel.find({}).sort({ date: 1 });

    // Prepare the data for the report
    const dates = data.map(d => d.date);
    const moneySupply = data.map(d => d.moneySupply);
    const inflationRate = data.map(d => d.inflationRate);
    const gdp = data.map(d => d.gdp);

    // Create a report object
    const report = {
      dates,
      moneySupply,
      inflationRate,
      gdp
    };

    // Convert the report object to a JSON string
    const reportJson = JSON.stringify(report, null, 2);

    // Define the report file path
    const reportFilePath = path.join(__dirname, 'report.json');

    // Write the report to a file
    fs.writeFile(reportFilePath, reportJson, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Report generation failed' });
      } else {
        res.json({ success: true, message: 'Report generated', reportFilePath });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Report generation failed' });
  }
});

module.exports = router;
