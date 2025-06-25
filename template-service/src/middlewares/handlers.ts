import { NextFunction, Request, Response } from 'express';
import { APP_CONFIG } from '../config/constant';
import jwt from 'jsonwebtoken';

export const asyncHandler = (
  ...routerHandlers: Array<
    (req: Request, res: Response, next: NextFunction) => Promise<any> | any
  >
) => {
  return routerHandlers.map((middleware) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = middleware(req, res, next);

        if (result instanceof Promise) {
          result.catch(next);
        }
      } catch (error) {
        next(error);
      }
    };
  });
};

export const authHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, APP_CONFIG.JWT_SECRET);
    req.user = decoded as any;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const roleHandler =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
