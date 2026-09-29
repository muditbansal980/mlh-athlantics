import { Router, type Request, type Response } from 'express';

const router: Router = Router();

router.post('/register', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'User registration endpoint skeleton' });
});

router.post('/login', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'User login endpoint skeleton' });
});

export default router;
