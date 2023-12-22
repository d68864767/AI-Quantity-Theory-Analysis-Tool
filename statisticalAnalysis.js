// statisticalAnalysis.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ss = require('simple-statistics');

// Import the data model
const DataModel = mongoose.model('Data');

// Route to perform statistical analysis
router.get('/analyze', async (req, res) => {
  try {
    // Fetch all data from the database
    const data = await DataModel.find({});

    // Prepare the data for analysis
    const moneySupply = data.map(d => d.moneySupply);
    const inflationRate = data.map(d => d.inflationRate);
    const gdp = data.map(d => d.gdp);

    // Calculate the correlation between money supply and inflation rate
    const correlationMoneyInflation = ss.sampleCorrelation(moneySupply, inflationRate);

    // Calculate the correlation between money supply and GDP
    const correlationMoneyGdp = ss.sampleCorrelation(moneySupply, gdp);

    // Calculate the correlation between inflation rate and GDP
    const correlationInflationGdp = ss.sampleCorrelation(inflationRate, gdp);

    // Return the results
    res.json({
      success: true,
      correlationMoneyInflation,
      correlationMoneyGdp,
      correlationInflationGdp
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Statistical analysis failed' });
  }
});

module.exports = router;
