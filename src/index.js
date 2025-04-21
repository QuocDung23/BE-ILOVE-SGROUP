import express from 'express';
import fs from 'fs';
import connectDB from './databases/database.connection.js';
import routers from './apis/index.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

connectDB().then(() => {
  // Routes
  app.use('/api', routers);
  
  // Error handler middleware
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});