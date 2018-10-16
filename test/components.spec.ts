/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import 'marko/node-require';
import { expect } from 'chai';
import { resolve } from 'path';
import components from '../src/components';

const timeout = 5000;
const expectedComps: any[] = require('./data/expected-comps');
const expectedCompNames = expectedComps.map(c => c.name);
const expectedCompPaths = expectedComps.map(c => resolve(c.dir));

describe('components (integration)', () => {
  describe('given no root dir', () => {
    it('should find all components in current dir subdirs', () => {
      const foundComponents = components();

      expect(foundComponents.length).to.equal(4);
    }).timeout(timeout);
  });

  describe('given root dir', () => {
    it('should find all components in subdirs', () => {
      const foundComponents = components('./test/examples');

      expect(foundComponents.map(c => c.tag.name)).to.have.same.members(expectedCompNames);
      expect(foundComponents.map(c => c.path)).to.have.same.members(expectedCompPaths);
    }).timeout(timeout);
  });
});
