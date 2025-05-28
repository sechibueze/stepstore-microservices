import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config/constant';

export const generateToken = (payload: object) => {
  return jwt.sign(payload, APP_CONFIG.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, APP_CONFIG.JWT_SECRET);
};
