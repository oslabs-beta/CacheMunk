import express, { Request, Response, NextFunction } from 'express';
import dataRouter from './routers/dataRouter.js'

const app = express();

// specify the port number to listen on
const PORT = 3000;

// express middleware that parses JSON bodies
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  console.log('received ping');
  res.json('pong');
});

app.use('/data', dataRouter)


app.use('/*', (req: Request, res: Response) => {
  res.status(404).json('Page Not Found')
});

app.use((err: { log: string, status: number, message: string}, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: object = {
    log: 'Express error handler caught unknown middleware error',
    status: 500, 
    message: { err: 'An error occurred'},
  }
  const errorObj = Object.assign({}, defaultErr, err)
  return res.status(errorObj.status).json(errorObj.message)
  // res.status(500).send(err)
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT.toString()}`);
});
