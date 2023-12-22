// config.js

module.exports = {
  // MongoDB configuration
  db: {
    host: 'localhost',
    port: '27017',
    name: 'ai-quantity-theory-analysis-tool'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000
  },

  // API routes
  api: {
    dataIngestion: '/api/dataIngestion',
    mlModels: '/api/mlModels',
    statisticalAnalysis: '/api/statisticalAnalysis',
    visualization: '/api/visualization',
    reporting: '/api/reporting'
  },

  // Production configuration
  production: {
    staticFolder: 'client/build',
    indexPath: path.resolve(__dirname, 'client', 'build', 'index.html')
  }
};
