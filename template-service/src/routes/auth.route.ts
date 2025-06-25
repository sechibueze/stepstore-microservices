import { Request, Response } from 'express';
import * as express from 'express';
import { validateInput } from '../middlewares/validate';
import { registerSchema, loginSchema, updateUserSchema } from '../schemas/auth';
import {
  deleteUser,
  listUsers,
  loginUser,
  refreshToken,
  registerUser,
  updateUser,
} from '../controllers/user.controller';
import { asyncHandler, authHandler } from '../middlewares/handlers';
const router = express.Router();

router.post(
  '/register',
  validateInput(registerSchema),
  asyncHandler(registerUser)
);
router.post('/login', validateInput(loginSchema), asyncHandler(loginUser));
router.post('/refresh', asyncHandler(refreshToken));

router.use(authHandler as unknown as express.RequestHandler);

router.get('/', asyncHandler(listUsers));
router.patch('/me', validateInput(updateUserSchema), asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;
