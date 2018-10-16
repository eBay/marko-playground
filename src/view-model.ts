/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { Fixtures } from './fixtures';
import { Playground } from './playground';
import { Meta } from './meta';
import { Render } from './components';
import { Dependencies, noDeps } from './dependencies';

interface ComponentListVm extends Dependencies {
  componentNames: string[];
}

export type SingleComponentPageVm = Meta & PlaygroundVm;

export type ComponentListPageVm = Meta & ComponentListVm;

export interface PlaygroundVm extends ComponentListVm {
  componentName: string;
  useCases: Fixtures;
  render?: Render;
  _?: Render;
  flags: string[];
}

export function pageVm(additionalVm: PlaygroundVm | ComponentListVm,
                       meta: Meta = {}): SingleComponentPageVm | ComponentListPageVm {
  return { ...meta, ...additionalVm };
}

export function compListVm(componentNames: string[] = [],
                           { packagePaths = [], dependencies = [] }: Dependencies = noDeps
                          ): ComponentListVm {
  return {
    componentNames,
    packagePaths,
    dependencies
  };
}

export function playgroundVm(playground: Playground,
                             componentNames: string[],
                             { packagePaths = [], dependencies = [] }: Dependencies = noDeps,
                             flags: string[] = []
                            ): PlaygroundVm {
  return {
    componentNames,
    componentName: playground.compName,
    useCases: playground.fixtures,
    render: playground.render,
    packagePaths,
    dependencies,
    flags
  };
}
