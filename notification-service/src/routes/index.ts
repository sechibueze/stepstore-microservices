import { Request, Response } from 'express';
import * as express from 'express';
import { validateInput } from '../middlewares/validate';

import { asyncHandler, authHandler } from '../middlewares/handlers';
const router = express.Router();

router.patch('/me', (req, res) => {
  res.send('OK');
});

export default router;
