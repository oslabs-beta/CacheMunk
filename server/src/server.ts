import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import { getCacheInfo, getCacheResponseTimes } from './analytics.js';
import { getCacheSize } from './controllers/cacheSize.js';
import { deleteCache } from './controllers/deleteCache.js';

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
  res.status(200).json(cacheInfo);
});

// Endpoint to get response times for /cache (number[])
app.get('/cache-response-times', (req, res) => {
  console.log('Received request to /cache-response-times');
  const cacheResponseTimes = getCacheResponseTimes();
  res.status(200).json(cacheResponseTimes);
});

// Endpoint to get the size of the redis cache
app.get('/cacheSize', getCacheSize, (req, res) => {
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
