/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { LassoConfig } from 'lasso/lib/Lasso';
import { appMeta, pgMeta } from './meta';

export interface ServerConfig {
  url: string;
  port: number;
  pgVersion: string;
  appVersion: string;
  appName: string;
  lasso: LassoConfig;
}

export default function (port: number, lasso: LassoConfig): ServerConfig {

  return {
    url: `http://localhost:${port}`,
    port,
    pgVersion: pgMeta.version,
    appVersion: appMeta.version,
    appName: appMeta.name,
    lasso
  };
}
