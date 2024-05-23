import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import { getCacheInfo, getCacheResponseTimes } from './analytics.js';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// express middleware that parses JSON bodies
app.use(express.json());

// route for all database requests
app.use('/data', dataRouter);

// Endpoint to get cache-analytics
app.get('/cache-analytics', (req, res) => {
  const cacheInfo = getCacheInfo();
  res.json(cacheInfo);
});

// Endpoint to get response times for /cache
app.get('/cache-response-times', (req, res) => {
  const cacheResponseTimes = getCacheResponseTimes();
  res.json(cacheResponseTimes);
});

app.post('/test/insert', (req, res) => {
  res.json('Endpoint: test/insert - QuerySelect: insert');
});

app.get('/test/select-cache', (req, res) => {
  res.json('Endpoint: test/select-cache - QuerySelect: select, CacheSwitch: true');
});

app.get('/test/select-no-cache', (req, res) => {
  res.json('Endpoint: test/select-no-cache - QuerySelect: select, CacheSwitch: false');
});

app.get('/test/costly-cache', (req, res) => {
  res.json('Endpoint: test/costly-cache - QuerySelect: costly, CacheSwitch: true');
});

app.get('/test/costly-no-cache', (req, res) => {
  res.json('Endpoint: test/costly-no-cache - QuerySelect: costly, CacheSwitch: false');
});

app.get('/test/initial', (req, res) => {
  res.json('Endpoint: /test/initial - initial test');
});

// First endpoint: /test/cache-analytics
app.get('/test/cache-analytics', (req, res) => {
  const cacheAnalytics = {
    cacheHits: 3,
    cacheMisses: 4,
  };
  res.json(cacheAnalytics);
});

// Second endpoint: /test/cache-response-times
app.get('/test/cache-response-times', (req, res) => {
  const responseTimes = [13, 3, 4, 5];
  res.json(responseTimes);
});

app.use('*', (req, res) => {
  res.status(404).json('Page Not Found');
});

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
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT.toString()}`);
});
