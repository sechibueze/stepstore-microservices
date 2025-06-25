import { Response } from 'express';

export class ResponseBuilder {
  private res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  send({ valid, message = '', data = null, error = null, status = 200 }) {
    return this.res.status(status).json({ valid, message, data, error });
  }

  ok({ data = null, message = 'OK' }) {
    return this.send({ valid: true, message, data, status: 200 });
  }

  created({ data = null, message = 'Created' }) {
    return this.send({ valid: true, message, data, status: 201 });
  }

  badRequest({ message = 'Bad Request', error = null }) {
    return this.send({ valid: false, message, error, status: 400 });
  }

  unauthorized(message = 'Unauthorized', error = null) {
    return this.send({ valid: false, message, error, status: 401 });
  }
  conflict({ message = 'Conflict', error = {} }) {
    return this.send({ valid: false, message, data: null, error, status: 409 });
  }

  notFound({ message = 'Not Found', error = {} }) {
    return this.send({ valid: false, data: null, message, error, status: 404 });
  }

  serverError(message = 'Internal Server Error', error = null) {
    return this.send({ valid: false, message, error, status: 500 });
  }

  custom(status = 200, valid = true, message = '', data = null, error = null) {
    return this.send({ valid, message, data, error, status });
  }
}
