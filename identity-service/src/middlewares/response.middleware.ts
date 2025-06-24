import { ResponseBuilder } from '../utils/response.builder';

export const responseHandler = (req, res, next) => {
  res.respondWith = new ResponseBuilder(res);
  next();
};
