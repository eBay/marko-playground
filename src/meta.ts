/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { join } from 'path';
import { existsSync } from 'fs';

export interface Meta {
  appRoot?: string;
  appName?: string;
  appVersion?: string;
  pgVersion?: string;
}

export interface AppMeta {
  name: string;
  version: string;
}

export interface PgMeta {
  version: string;
}

export const appRoot = process.cwd();

export const pgRoot = join(__dirname, '..');

const localPackagePath = join(appRoot, 'package.json');

export const appMeta: AppMeta = existsSync(localPackagePath) ? require(localPackagePath) : { name: '', version: '' };

export const pgMeta: PgMeta = require(join(pgRoot, 'package.json'));

export default function(): Meta {
  return {
    appRoot,
    appName: appMeta.name,
    appVersion: appMeta.version,
    pgVersion: pgMeta.version
  };
}
