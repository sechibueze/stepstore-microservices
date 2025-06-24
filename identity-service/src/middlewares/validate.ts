import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { validateSchema } from '../utils/validate-schema';

export const validateInput = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { data, errors } = validateSchema(schema, req.body);

    if (!data) {
      res
        .status(422)
        .json({ message: 'Validation errors', data: null, errors });
      return;
    }

    next();
  };
};
