import config from 'config';
import express from 'express';

import log from '../libraries/log';

export default class AbstractController {
  constructor() {
    this.router = express.Router();

    this.initRouter();

    this.promisifyMiddlewares();
  }

  initRouter() { // eslint-disable-line class-methods-use-this
    throw new Error('"initRouter" method must be implemented');
  }

  promisifyMiddlewares() {
    this.router.stack.forEach(({ route }) => {
      route.stack.forEach((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') {
          const oldHandle = stack.handle;

          // eslint-disable-next-line no-param-reassign
          stack.handle = AbstractController.wrapPromise(oldHandle);
        }
      });
    });
  }

  static wrapPromise(middleware) {
    return (request, response, next) => {
      middleware(request, response, next)
        .catch(next);
    };
  }

  static handle404(request, response, next) {
    const error = new Error(`Not found: ${request.url}`);

    error.status = 404;

    next(error);
  }

  static handle500(rawError, request, response, next) { // eslint-disable-line no-unused-vars
    const error = typeof rawError === 'string' ? new Error(rawError) : rawError;

    if (config.get('environment') !== 'test' && error.status !== 404) {
      log.server.error(error.message);
      log.debug(error.stack);
    }

    response.status(error.status || 500);
    response.json({
      error: error.message,
    });
  }
}
