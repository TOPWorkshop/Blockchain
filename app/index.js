import fs from 'fs';
import path from 'path';
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';

import AbstractController from './controllers';

export default class Server {
  static get CONTROLLERS_DIR() { return path.join(__dirname, 'controllers'); }

  constructor() {
    this.config = config.get('server');

    this.app = express();

    this.initMiddlewares();
    this.initRoutes();
  }

  initMiddlewares() {
    this.app.use(bodyParser.json());
  }

  initRoutes() {
    fs
      .readdirSync(Server.CONTROLLERS_DIR)
      .filter(filename => filename !== 'index.js' && filename.substr(-3) === '.js')
      .forEach((filename) => {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Controller = require(path.join(Server.CONTROLLERS_DIR, filename));

        const controller = new Controller();

        this.app.use(controller.router);
      });
  }

  initFallbackRoutes() {
    this.app.use(AbstractController.handle404);
    this.app.use(AbstractController.handle500);
  }

  async listen() {
    await new Promise(resolve => this.app.listen(this.config.port, resolve));
  }
}
