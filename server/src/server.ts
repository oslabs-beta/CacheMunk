import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { pool } from './db.js';
import { cache } from './cache/redisClient.js';
import { getData } from './controllers/cachingController.js';
import { runTests } from './benchmarks/benchmark.js';
import dataRouter from './routers/dataRouter.js';
import { getCacheInfo, getCacheResponseTimes } from './analytics.js';
import { getStringKeySize } from './controllers/cacheSize.js';
import { deleteCache } from './controllers/deleteCache.js';

const app = express();

// specify the port number to listen on
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3030;

// Function to test the database connection on startup
void (async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    // eslint-disable-next-line no-console
    console.log('Database connected successfully!!!');
    client.release();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error connecting to the database:');
  }
})();

// Function to test the cache connection on startup
void (async () => {
  try {
    await cache.set('ping', 'pong', []);

    const res = await cache.get('ping');
    if (res === 'pong') {
      console.log('Successfully received pong from redis!');
      console.log('version updated 10:57pm');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error connecting to redis oops:');
  }
})();

// express middleware that parses JSON bodies
app.use(express.json());

app.use(express.static(path.resolve('client/public')));
app.use(express.static(path.resolve('client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'));
});

app.use('/summary', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'));
});

// route for all database requests
app.use('/data', dataRouter);

// Endpoint to get cache-analytics
app.get('/cache-analytics', (req, res) => {
  const cacheInfo = getCacheInfo();
  res.status(200).json(cacheInfo);
});

interface BenchmarkBody {
  clients: number;
  requests: number;
  queryKey: string;
  'Cache-Control': string;
}

app.post('/benchmark', (req, res) => {
  const payload = req.body as BenchmarkBody;
  const { clients, requests, queryKey } = payload;
  const cacheControl = payload['Cache-Control'];

  let testFunc;
  if (cacheControl === 'no-cache') {
    // eslint-disable-next-line @typescript-eslint/require-await
    testFunc = async () => getData(queryKey, 'no-cache', false);
  } else {
    // eslint-disable-next-line @typescript-eslint/require-await
    testFunc = async () => getData(queryKey, '', false);
  }

  runTests(clients, requests, queryKey, testFunc)
    .then((data) => {
      res.json(data);
    })
    .catch((err: unknown) => {
      console.log(err);
      res.status(500).json('unknown error');
    });
});

// Endpoint to get response times for /cache (number[])
app.get('/cache-response-times', (req, res) => {
  console.log('Received request to /cache-response-times');
  const cacheResponseTimes = getCacheResponseTimes();
  res.status(200).json(cacheResponseTimes);
});

// Endpoint to get the size of the redis cache
app.get('/cacheSize', getStringKeySize, (req, res) => {
  res.status(200).json(res.locals.cacheSize);
});

// End point to delete all redis cache
app.get('/deleteCache', deleteCache, (req, res) => {
  res.status(200).send('cache, cachehit, cachemiss, and response time should all be deleted');
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
    console.log('global middlware error:', err);
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
