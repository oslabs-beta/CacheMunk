import express from 'express';

const app = express();

// specify the port number to listen on
const PORT = 3000;

// express middleware that parses JSON bodies
app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('received ping');
  res.json('pong');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT.toString()}`);
});
