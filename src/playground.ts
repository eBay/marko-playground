/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import * as glob from 'glob';
import { join } from 'path';
import fixturesInPath, { Fixtures } from './fixtures';
import { Component, Render } from './components';

export class Playground {
  compName: string;
  compPath: string;
  compRenderer: string;
  compTemplate: string;
  render: Render;
  fixtures: Fixtures;
  customTemplate?: string;

  constructor(component: Component, playgroundDir: string = '') {
    this.compName = component.tag.name;
    this.compPath = component.path;
    this.compRenderer = component.tag.renderer;
    this.compTemplate = component.tag.template;
    this.render = component.render;
    this.fixtures = fixturesInPath(component.path);
    this.customTemplate = customTemplateInPath(join(component.path, playgroundDir));
  }
}

export function withFixtures(playground: Playground): boolean {
  return Object.keys(playground.fixtures).length > 0;
}

export function customTemplateInPath(playgroundPath: string = ''): string | undefined {
  return glob.sync(`${playgroundPath}/?(index|template).marko`, { absolute: true })[0];
}
