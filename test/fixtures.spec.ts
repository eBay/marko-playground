/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { resolve } from 'path';
import { expect } from 'chai';
import fixtures from '../src/fixtures';

describe('fixtures()', () => {
  describe('given component with fixtures', () => {
    it('should find all fixtures', () => {
      const compFixtures = fixtures(resolve('./test/examples/comps/comp-single-file'));
      const expectedFixtures = require('./data/fixtures');

      expect(compFixtures).to.deep.equal(expectedFixtures);
    });
  });

  describe('given component without fixtures', () => {
    it('should create a default empty fixture', () => {
      const compFixtures = fixtures(resolve('./test/examples/comps/comp-single-file-no-fixtures'));
      const expectedFixtures = { default: {} };

      expect(compFixtures).to.deep.equal(expectedFixtures);
    });
  });
});
