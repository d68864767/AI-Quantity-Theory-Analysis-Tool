// visualization.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { CanvasRenderService } = require('chartjs-node-canvas');

// Import the data model
const DataModel = mongoose.model('Data');

// Route to generate visualization
router.get('/visualize', async (req, res) => {
  try {
    // Fetch all data from the database
    const data = await DataModel.find({}).sort({ date: 1 });

    // Prepare the data for visualization
    const dates = data.map(d => d.date);
    const moneySupply = data.map(d => d.moneySupply);
    const inflationRate = data.map(d => d.inflationRate);
    const gdp = data.map(d => d.gdp);

    // Define the chart configuration
    const configuration = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Money Supply',
            data: moneySupply,
            borderColor: 'rgb(75, 192, 192)',
            fill: false
          },
          {
            label: 'Inflation Rate',
            data: inflationRate,
            borderColor: 'rgb(255, 99, 132)',
            fill: false
          },
          {
            label: 'GDP',
            data: gdp,
            borderColor: 'rgb(54, 162, 235)',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Economic Indicators Over Time'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    };

    // Create a canvas render service
    const canvasRenderService = new CanvasRenderService(800, 600);

    // Render the chart to a data URL
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);

    // Return the data URL
    res.json({ success: true, dataUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Visualization failed' });
  }
});

module.exports = router;
