import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import { getCacheInfo, getCacheResponseTimes } from './analytics.js';
import { exec } from 'child_process';
import fs from 'fs';
import client from 'prom-client';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// express middleware that parses JSON bodies
app.use(express.json());

// Define a histogram to measure HTTP request duration in milliseconds
const httpRequestDurationMilliseconds = new client.Histogram({
  name: 'http_request_duration_milliseconds',
  help: 'Duration of HTTP requests in milliseconds',
  // Define the labels used in the histogram
  labelNames: ['method', 'route', 'status'],
  // Buckets in seconds (0ms to 10ms)
  buckets: [
    0.0005, 0.001, 0.0015, 0.002, 0.0025, 0.003, 0.0035, 0.004, 0.0045, 0.005,
    0.0055, 0.006, 0.0065, 0.007, 0.0075, 0.008, 0.0085, 0.009, 0.0095, 0.01
  ] // 0.5ms to 10ms
});

// Middleware to measure request duration
app.use((req, res, next) => {
  // Start the timer
  const end = httpRequestDurationMilliseconds.startTimer();
  
  // When the response finishes, stop the timer and record the duration
  res.on('finish', () => {
    // Stop the timer and record the duration with additional labels
    end({
      method: req.method,
      route: req.route?.path || req.path, // Route or path of the request
      status: res.statusCode // HTTP status code of the response
    });
  });
  
  // Pass control to the next middleware
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// route for all database requests
app.use('/data', dataRouter);

// Endpoint to get cache-analytics
app.get('/cache-analytics', (req, res) => {
  const cacheInfo = getCacheInfo();
  res.json(cacheInfo);
});

// Endpoint to get response times for /cache (number[])
app.get('/cache-response-times', (req, res) => {
  console.log('Received request to /cache-response-times');
  const cacheResponseTimes = getCacheResponseTimes();
  res.json(cacheResponseTimes);
});

app.get('/run-artillery-test', (req, res) => {
  exec('artillery run test.yml -o results.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Load test failed');
    }

    const data = JSON.parse(fs.readFileSync('results.json', 'utf8'));
    res.json(data);
  });
});

// 404 error handler
app.use('*', (req, res) => {
  res.status(404).json('Page Not Found');
});

// Global error handler
app.use(
  (
    err: { log: string; status: number; message: string },
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const defaultErr: object = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    res.status(errorObj.status).json(errorObj.message);
  },
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT.toString()}`);
});
