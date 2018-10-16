/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { Request } from 'express';
import { RequestHandler, Response } from 'marko/express';
import Template from 'marko/src/runtime/html/Template';
import 'marko/node-require';

import { Meta } from './meta';
import { Dependencies } from './dependencies';
import { reportVmFiles } from './logging';
import { compListVm, pageVm, playgroundVm } from './view-model';
import { Playground, withFixtures } from './playground';
import { resolve } from 'path';

export interface RouteMatch {
  route: string;
  handler: RequestHandler;
}

export default function (
    playgrounds: Playground[] = [],
    allDepsFn: (p?: Playground) => Dependencies,
    meta: Meta = {},
    flags: string[] = []
  ): RouteMatch[] {

  const playgroundsWithFixtures: Playground[] = playgrounds.filter(withFixtures);

  const componentNames = playgroundsWithFixtures.map(p => p.compName);

  const indexRouteMatch: RouteMatch = {
    route: '/',
    handler: componentListHandler(componentNames, allDepsFn(), meta)
  };

  const componentRouteMatches: RouteMatch[] = playgrounds.map(playground => ({
    route: `/${playground.compName}`,
    handler: componentHandler(
      playground,
      componentNames,
      allDepsFn(playground),
      meta,
      flags)
  }));

  return [indexRouteMatch].concat(componentRouteMatches);
}

function componentListHandler(componentNames: string[],
                              allDeps: Dependencies,
                              meta: Meta
                              ): RequestHandler {
  const template: Template = require('../templates/mpg-index.marko');
  const vm = pageVm(compListVm(componentNames, allDeps), meta);

  reportVmFiles(vm);

  return (req: Request, res: Response) => res.marko(template, vm);
}

function componentHandler(playground: Playground,
                          componentNames: string[],
                          compDeps: Dependencies,
                          meta: Meta,
                          flags: string[]
): RequestHandler {
  const genericPlaygroundTemplate = '../templates/mpg-comp.marko';
  const customTemplateRelPath = playground.customTemplate && resolve(playground.customTemplate);
  const template: Template = require(customTemplateRelPath || genericPlaygroundTemplate);

  const pgVm = playgroundVm(playground, componentNames, compDeps, flags);

  const vm = pageVm(pgVm, meta);

  reportVmFiles(vm);

  return (req: Request, res: Response) => res.marko(template, vm);
}
