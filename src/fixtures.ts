/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import * as glob from 'glob';
import { basename } from 'path';

export type Fixtures = { [name: string]: any } | {};

export default function (componentPath: string): Fixtures {
  const fixtureFilesMask = `${componentPath}/**/fixtures/*.@(js|json)`;
  const foundFixtures = findFixtures(fixtureFilesMask);
  const defaultFixture = { default: {} };

  return Object.keys(foundFixtures).length ? foundFixtures : defaultFixture;
}

function findFixtures(fixtureMask: string): Fixtures {
  const globOptions = { absolute: true };

  return glob.sync(fixtureMask, globOptions).reduce(fixtures, {});
}

function fixtures(existingFixtures: Fixtures, newFixtureFilename: string): Fixtures {
  const newFixtureName = basename(newFixtureFilename).split('.')[0].replace(/-/g, ' ');

  return { ...{ [newFixtureName]: require(newFixtureFilename) }, ...existingFixtures };
}
