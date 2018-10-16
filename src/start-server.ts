/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { reportServerStart } from './logging';
import express = require('express');
import markoExpress = require('marko/express');
import 'marko/node-require';
import * as lasso from 'lasso';
import { serveStatic } from 'lasso/middleware';
import { ServerConfig } from './server-config';
import { RouteMatch } from './routes';

export default function(cfg: ServerConfig, routes: RouteMatch[]): void {
  const app = express() as markoExpress.Application;

  lasso.configure(cfg.lasso);
  app.use(serveStatic());
  app.use(markoExpress());

  routes.forEach(({ route, handler }) => app.get(route, handler));

  app.listen(cfg.port, () => {
    reportServerStart(cfg);

    if (process.send) {
      // todo: add browser-refresh support
      process.send({ event: 'online', url: cfg.url });
    }
  });
}
