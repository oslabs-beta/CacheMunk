import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import client from 'prom-client';
import cors from 'cors';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// express middleware that parses JSON bodies
app.use(express.json());

// use cors middleware
app.use(cors());

// registry for prometheus metrics
const register = new client.Registry();

// default metrics i
client.collectDefaultMetrics({ register });

// Define metrics

// Duration of HTTP Request
const httpRequestDurationMilliseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.5, 1, 5, 10, 25, 50, 100], // adjusted buckets for response time
});

// Cache Hits
const cacheHits = new client.Counter({
  name: 'cache_hits',
  help: 'Number of cache hits',
});

// Cache Misses
const cacheMisses = new client.Counter({
  name: 'cache_misses',
  help: 'Number of cache misses',
});

// Register the metrics
register.registerMetric(httpRequestDurationMilliseconds);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);

// Array to store response times
const cacheResponseTimes: number[] = [];

// Middleware to collect response time
app.use((req, res, next) => {
  // Start the timer using the Prometheus client's startTimer function - records in seconds
  const end = httpRequestDurationMilliseconds.startTimer();

  // Register an event listener for the "finish" event of the response
  res.on('finish', () => {
    // Use an object to store labels for the Prometheus histogram
    const labels = {
      route: req.route ? req.route.path : req.path, // Use the route path or path if route is not available
      method: req.method, // HTTP method used for the request
      status_code: res.statusCode, // HTTP status code of the response
    };

    // Check if the URL starts with "/data" to determine if this is a database request
    if (req.originalUrl.startsWith('/data')) {
      // End the timer, convert the duration to milliseconds, and record for database-related requests
      const durationInSeconds = end(labels); // Stop the timer and get duration in seconds
      const durationInMilliseconds = durationInSeconds * 1000; // Convert duration to milliseconds
      httpRequestDurationMilliseconds.observe(labels, durationInMilliseconds); // Record the duration in milliseconds
      cacheResponseTimes.push(durationInMilliseconds); // Optionally store the response time in an array
      console.log('Cache Response Times Array:', cacheResponseTimes); // Logging the array for debugging
    } else {
      // End the timer for non-database requests but don't push to the array, convert and record
      const durationInSeconds = end(labels);
      const durationInMilliseconds = durationInSeconds * 1000; // Convert duration to milliseconds
      httpRequestDurationMilliseconds.observe(labels, durationInMilliseconds); // Record the duration in milliseconds
    }
  });

  // Proceed to the next middleware function
  next();
});

//
// Export the metrics for use in other files
export { cacheHits, cacheMisses };

// simple health check route
app.get('/ping', (req: Request, res: Response) => {
  console.log('received ping');
  res.json('pong');
});

// route for all database requests
app.use('/data', dataRouter);

// set metrics endpoint for prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Endpoint to get response times for /cache
app.get('/cache-response-times', (req, res) => {
  res.json(cacheResponseTimes);
});

app.use('/*', (req: Request, res: Response) => {
  res.status(404).json('Page Not Found');
});

app.use(
  (
    err: { log: string; status: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const defaultErr: object = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message);
    // res.status(500).send(err)
  },
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT.toString()}`);
});
