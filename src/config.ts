/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { join } from 'path';
const root = process.cwd();

const pgConfigDir = process.env.CONFIG_DIR || 'test/playground';
const localConfigRelPath = process.env.CONFIG || join(pgConfigDir, 'config');
export const app = configWithOverrides(
  mergedConfig('./config/playground', localConfigRelPath),
  process.env
);

export const lasso = mergedConfig(app.lassoConfig, app.lassoLocalConfigDir);

export function mergedConfig(mainConfigOrPath: any, localConfigRelPath: string | undefined = undefined): any {
  const mainConfig =
        (typeof mainConfigOrPath === 'object') ? mainConfigOrPath : safeRequire(join('..', mainConfigOrPath));
  const localConfig = localConfigRelPath && safeRequire(join(root, localConfigRelPath));

  return { ...mainConfig, ...localConfig };
}

function safeRequire(filePath: string): any {
  let result = {};

  try {
    if (require.resolve(filePath)) {
      result = require(filePath);
    }
  } catch (e) {
    if (e.code && e.code !== 'MODULE_NOT_FOUND') {
      // tslint:disable-next-line:no-console
      console.error(e.code);
    }
  }

  return result;
}

export interface AppConfig {
  port: number;
  componentsRootDir: string;
  playgroundDir: string;
  playgroundConfigDir: string;
  lassoLocalConfigDir: string;
  lassoConfig: object;
  flags: string[];
}

export function configWithOverrides(config: AppConfig, env: any): AppConfig {
  const playgroundConfigDir = env.CONFIG_DIR || 'test/playground';
  const lassoLocalConfigDir = env.LASSO_CONFIG || join(playgroundConfigDir, 'lasso');
  const flags = (env.FLAGS || '').split(','); // todo: add to config

  return {
    port: env.PORT || config.port,
    componentsRootDir: env.COMPONENTS_ROOT_DIR || config.componentsRootDir,
    playgroundDir: env.PLAYGROUND_DIR || config.playgroundDir,
    playgroundConfigDir,
    lassoLocalConfigDir,
    lassoConfig: config.lassoConfig,
    flags
  };
}
