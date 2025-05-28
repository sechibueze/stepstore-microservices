import { Request, Response } from 'express';
import * as express from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth';
const router = express.Router();

// router.post('/register', validate(registerSchema), registerUser);
// router.post('/login', validate(loginSchema), loginUser);

export default router;
