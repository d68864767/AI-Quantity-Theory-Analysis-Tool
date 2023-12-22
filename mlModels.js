// mlModels.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tf = require('@tensorflow/tfjs-node');

// Import the data model
const DataModel = mongoose.model('Data');

// Route to train the model
router.post('/train', async (req, res) => {
  try {
    // Fetch all data from the database
    const data = await DataModel.find({});

    // Prepare the data for training
    const xs = data.map(d => [d.moneySupply, d.gdp]);
    const ys = data.map(d => d.inflationRate);

    // Convert the data to tensors
    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [2] }));

    // Compile the model
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Train the model
    await model.fit(xsTensor, ysTensor, { epochs: 100 });

    // Save the model
    await model.save('file://./models/model.json');

    res.json({ success: true, message: 'Model training completed' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Model training failed' });
  }
});

// Route to make predictions
router.post('/predict', async (req, res) => {
  try {
    // Load the model
    const model = await tf.loadLayersModel('file://./models/model.json');

    // Prepare the input data
    const xs = [[req.body.moneySupply, req.body.gdp]];

    // Convert the data to a tensor
    const xsTensor = tf.tensor2d(xs);

    // Make a prediction
    const ysTensor = model.predict(xsTensor);

    // Convert the tensor to an array
    const ys = await ysTensor.array();

    res.json({ success: true, prediction: ys[0][0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Prediction failed' });
  }
});

module.exports = router;
