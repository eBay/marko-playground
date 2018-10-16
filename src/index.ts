/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

require('lasso/node-require-no-op').enable('.less', '.css');

import componentsInDir, { Component } from './components';
import routes, { RouteMatch } from './routes';
import { mergedConfig, AppConfig, app as appConfig, lasso as lassoConfig } from './config';
import serverConfig from './server-config';
import startServer from './start-server';
import { Playground } from './playground';
import { reportPlaygrounds } from './logging';
import appMeta, { Meta } from './meta';
import { allDepsFn } from './dependencies';

const {
  componentsRootDir,
  playgroundDir,
  playgroundConfigDir,
  port,
  lassoLocalConfigDir,
  flags }: AppConfig = appConfig;

const lasso = mergedConfig(lassoConfig, lassoLocalConfigDir);

const playgrounds: Playground[] = componentsInDir(componentsRootDir).map(
  (c: Component) => new Playground(c, playgroundDir)
);

const meta: Meta = appMeta();

const appRoutes: RouteMatch[] = routes(
              playgrounds,
                allDepsFn(meta, playgroundConfigDir),
                    meta,
                    flags);

reportPlaygrounds(playgrounds, componentsRootDir);

startServer(serverConfig(port, lasso), appRoutes);
