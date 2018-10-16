import { dirname, join, relative, resolve } from 'path';
import getComponentFiles = require('marko/src/components/taglib/TransformHelper/getComponentFiles');
import { existsSync } from 'fs';
import { Playground } from './playground';
import { Meta } from './meta';

export interface Dependencies {
  packagePaths: string[];
  dependencies: string[];
}
export const noDeps: Dependencies = {
  packagePaths: [],
  dependencies: []
};

export function allDepsFn(meta: Meta, playgroundConfigDir: string) {
  return (playground?: Playground): Dependencies => {
    const { packagePaths = [], dependencies = [] } = playground ? componentDependencies(playground) : {};

    return {
      packagePaths: allPackagePaths(meta.appRoot, playgroundConfigDir, packagePaths),
      dependencies
    };
  };
}

function componentDependencies(playground: Playground): Dependencies {
  return componentFiles(playground.compRenderer || playground.compTemplate);
}

export function componentFiles(compRendererPath: string,
                               getComponentFilesFn: (path: string) => any = getComponentFiles
                              ): Dependencies {
  const resolveToComp = (f: string) => resolve(dirname(compRendererPath), f);
  const compFiles: any = getComponentFilesFn(compRendererPath);
  const compPackagePaths = (compFiles && compFiles.package) ? [resolveToComp(compFiles.package)] : [];
  const compFileList = (compFiles && compFiles.file) ? [resolveToComp(compFiles.file)] : [];

  return {
    packagePaths: compPackagePaths,
    dependencies: compFiles ? compFiles.styles.map(resolveToComp).concat(compFileList) : []
  };
}

function pagePackagePaths(appRoot: string, existsSyncFn: (path: string) => boolean = existsSync): string[] {
  const appBrowserPath = join(appRoot, 'browser.json');

  return [
    '../browser.json',
    ...(existsSyncFn(appBrowserPath) ? [ relative(__dirname, appBrowserPath) ] : '')
  ];
}

export function allPackagePaths(appRoot: string = '',
                                pgConfigDir: string,
                                compPackagePaths: any[],
                                existsSyncFn: (path: string) => boolean = existsSync
                                ): string[] {
  const appCommonPackagePath = join(appRoot, pgConfigDir, 'browser.json');
  const appPackagePaths = existsSyncFn(appCommonPackagePath) ? [ appCommonPackagePath ] : [];

  return [
    ...pagePackagePaths(appRoot, existsSyncFn),
    ...appPackagePaths,
    ...compPackagePaths
  ];
}
