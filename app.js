// app.js

import React from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      model: null,
      analysis: null,
      visualization: null,
      report: null
    };
  }

  componentDidMount() {
    this.getData();
    this.trainModel();
    this.analyzeData();
    this.getVisualization();
    this.getReport();
  }

  getData = () => {
    axios.get('/api/dataIngestion')
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(err => console.log(err));
  }

  trainModel = () => {
    axios.post('/api/mlModels/train')
      .then(res => {
        this.setState({ model: res.data });
      })
      .catch(err => console.log(err));
  }

  analyzeData = () => {
    axios.get('/api/statisticalAnalysis/analyze')
      .then(res => {
        this.setState({ analysis: res.data });
      })
      .catch(err => console.log(err));
  }

  getVisualization = () => {
    axios.get('/api/visualization')
      .then(res => {
        this.setState({ visualization: res.data });
      })
      .catch(err => console.log(err));
  }

  getReport = () => {
    axios.get('/api/reporting')
      .then(res => {
        this.setState({ report: res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h1>AI Quantity Theory Analysis Tool</h1>
        <LineChart width={500} height={300} data={this.state.visualization}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
        <h2>Report</h2>
        <p>{this.state.report}</p>
      </div>
    );
  }
}

export default App;
