import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { APP_CONFIG } from '../config/constant';

const secret = APP_CONFIG.JWT_SECRET!;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
