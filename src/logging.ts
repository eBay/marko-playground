/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

// tslint:disable:no-console

import { relative } from 'path';
import chalk from 'chalk';
import { ComponentListPageVm, SingleComponentPageVm } from './view-model';
import { Playground } from './playground';
import { appRoot } from './meta';
import { ServerConfig } from './server-config';

const compColor = chalk.white.bold;
const fileColor = chalk.white.bold;
const appColor = chalk.white.bold;

console.debug = (...args: any[]): void => {
  if (process.env.DEBUG) {
    console.log(chalk.gray('[DEBUG]'), args.join(' '));
  }
};

export function reportServerStart({ pgVersion, appName, appVersion, url }: ServerConfig): void {
  console.info(appColor(`Started Playground v${pgVersion} for ${appName} v${appVersion} on ${url}\n`));
}

function isSingleComponent(vm: SingleComponentPageVm | ComponentListPageVm): vm is SingleComponentPageVm {
  return (<SingleComponentPageVm>vm).componentName !== undefined;
}

export function reportVmFiles(vm: SingleComponentPageVm | ComponentListPageVm): void {
  const pageName = isSingleComponent(vm) ? vm.componentName : 'index';

  if (vm.packagePaths.length || vm.dependencies.length) {
    console.debug(`${compColor(pageName)} packages/dependencies:`);
    vm.packagePaths.forEach(console.debug);
    vm.dependencies.forEach(console.debug);
  }
}

export function reportPlaygrounds(playgrounds: Playground[], componentsRootDir: string): void {
  if (!playgrounds.length) {
    const docUrl = 'https://github.com/eBay/marko-playground#components-discovery';
    console.info(`No components found in ${fileColor(componentsRootDir)}! Documentation: ${docUrl}`);
    return;
  }

  console.info('Components found:');

  playgrounds.forEach(pg => {
    const compName = compColor(pg.compName);
    
    console.info(`${compName} @ ${relative(appRoot, pg.compPath)}:`);

    if (pg.compRenderer) {
      console.debug(`- using renderer ${fileColor(`./${relative(pg.compPath, pg.compRenderer)}`)}...`);
    }

    if (pg.compTemplate) {
      console.debug(`- using template ${fileColor(`./${relative(pg.compPath, pg.compTemplate)}`)}...`);
    }

    if (pg.customTemplate) {
      const templatePath = `./${relative(pg.compPath, pg.customTemplate)}`;
      console.debug(`- using custom playground template: ${fileColor(templatePath)}...`);
    }

    const fixtureCount = Object.keys(pg.fixtures).length;

    if (fixtureCount) {
      console.info(`- using ${fixtureCount} fixtures...`);
    } else {
      const fixtures = fileColor('test/fixtures');
      console.error(`Error: no fixtures found for component ${compName} in ${fixtures}.`);
    }
  });
}
