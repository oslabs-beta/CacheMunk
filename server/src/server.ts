import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// express middleware that parses JSON bodies
app.use(express.json());

// Array to store response times
const cacheResponseTimes: number[] = [];
const cacheInfo = {
  cacheHits: 0,
  cacheMisses: 0,
};

export const incrCacheHits = (): void => { cacheInfo.cacheHits++ };
export const incrCacheMisses = (): void => { cacheInfo.cacheMisses++ };
export const addResponse = (execTime: number): void => { cacheResponseTimes.push(execTime) };

// route for all database requests
app.use('/data', dataRouter);

// Endpoint to get cache-analytics
app.get('/cache-analytics', (req, res) => {
  res.json(cacheInfo);
})

// Endpoint to get response times for /cache
app.get('/cache-response-times', (req, res) => {
  res.json(cacheResponseTimes);
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
