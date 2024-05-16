import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import client from 'prom-client';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// express middleware that parses JSON bodies
app.use(express.json());

// registry for prometheus metrics
const register = new client.Registry();

// default metrics i
client.collectDefaultMetrics({ register });

// Define metrics

// Duration of HTTP Request
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000], // buckets for response time
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
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);

// Middleware to collect response time
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      route: req.route ? req.route.path : req.path,
      method: req.method,
      status_code: res.statusCode,
    });
  });
  next();
});

// Export the metrics for use in other files
export { cacheHits, cacheMisses };

app.get('/ping', (req: Request, res: Response) => {
  console.log('received ping');
  res.json('pong');
});

app.use('/data', dataRouter);

// set metrics endpoint for prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
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
