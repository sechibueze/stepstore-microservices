import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateInput = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: result.error.errors });
      return;
    }

    next();
  };
};
