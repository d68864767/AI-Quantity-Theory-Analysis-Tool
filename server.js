const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dataIngestion = require('./dataIngestion');
const mlModels = require('./mlModels');
const statisticalAnalysis = require('./statisticalAnalysis');
const visualization = require('./visualization');
const reporting = require('./reporting');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai-quantity-theory-analysis-tool', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Bodyparser Middleware
app.use(bodyParser.json());

// Use Routes
app.use('/api/dataIngestion', dataIngestion);
app.use('/api/mlModels', mlModels);
app.use('/api/statisticalAnalysis', statisticalAnalysis);
app.use('/api/visualization', visualization);
app.use('/api/reporting', reporting);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));
