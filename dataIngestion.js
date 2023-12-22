// dataIngestion.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

// Define the schema for our data model
const DataSchema = new mongoose.Schema({
  date: Date,
  moneySupply: Number,
  inflationRate: Number,
  gdp: Number
});

// Create a model from the schema
const DataModel = mongoose.model('Data', DataSchema);

// Route to ingest data
router.post('/', (req, res) => {
  const filePath = req.body.filePath;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const data = new DataModel({
        date: new Date(row.date),
        moneySupply: parseFloat(row.moneySupply),
        inflationRate: parseFloat(row.inflationRate),
        gdp: parseFloat(row.gdp)
      });

      data.save()
        .then(() => console.log('Data saved successfully'))
        .catch(err => console.log(err));
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      res.json({ success: true, message: 'Data ingestion completed' });
    });
});

module.exports = router;
