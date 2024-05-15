import { Router, Request, Response } from 'express';

const router = Router();

router.get('/cache', (req: Request, res: Response) => {
  res.status(200).send('read with cache');
});

router.get('/nocache', (req: Request, res: Response) => {
  res.status(200).send('read without cache');
});

router.patch('/cache', (req: Request, res: Response) => {
  res.status(201).send('patch with cache');
});

router.patch('/nocache', (req: Request, res: Response) => {
  res.status(201).send('patch without cache');
});

export default router;
