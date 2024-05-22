import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js';
import cors from 'cors';

const app = express();

// specify the port number to listen on
const PORT = 3030;

// Enable CORS for all routes
app.use(cors());

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// express middleware that parses JSON bodies
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  console.log('received ping');
  res.json('pong');
});

app.use('/data', dataRouter);

app.post('/test/insert', (req, res) => {
  res.send('Endpoint: test/insert - QuerySelect: insert');
});

app.get('/test/select-cache', (req, res) => {
  res.send('Endpoint: test/select-cache - QuerySelect: select, CacheSwitch: true');
});

app.get('/test/select-no-cache', (req, res) => {
  res.send('Endpoint: test/select-no-cache - QuerySelect: select, CacheSwitch: false');
});

app.get('/test/costly-cache', (req, res) => {
  res.send('Endpoint: test/costly-cache - QuerySelect: costly, CacheSwitch: true');
});

app.get('/test/costly-no-cache', (req, res) => {
  res.send('Endpoint: test/costly-no-cache - QuerySelect: costly, CacheSwitch: false');
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
