/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { expect } from 'chai';
import { allPackagePaths } from '../../src/dependencies';

describe('allPackagePaths()', () => {
  describe('given no additional dependencies', () => {
    it('should return only playground app `browser.json`', () => {
      const mockExistsSync = () => false;
      const expected: string[] = [
        '../browser.json'
      ];

      expect(allPackagePaths('', '', [],mockExistsSync)).to.deep.equal(expected);
    });
  });

  describe('given additional app dependencies', () => {
    it('should return them all', () => {
      const appDep = 'app-root/browser.json';
      const mockExistsSync = (path: string) => path === appDep;
      const expected: string[] = [
        '../browser.json',
        `../${appDep}`
      ];

      expect(allPackagePaths('app-root', 'pg-config-dir', [],mockExistsSync)).to.deep.equal(expected);
    });
  });

  describe('given additional playground dependencies', () => {
    it('should return them all', () => {
      const pgDep = 'app-root/pg-config-dir/browser.json';
      const mockExistsSync = (path: string) => path === pgDep;
      const expected: string[] = [
        '../browser.json',
        pgDep
      ];

      expect(allPackagePaths('app-root', 'pg-config-dir', [],mockExistsSync)).to.deep.equal(expected);
    });
  });

  describe('given all kinds of additional dependencies', () => {
    it('should return them all', () => {
      const mockExistsSync = () => true;
      const expected: string[] = [
        '../browser.json',
        '../app-root/browser.json',
        'app-root/pg-config-dir/browser.json'
      ];

      expect(allPackagePaths('app-root', 'pg-config-dir', [],mockExistsSync)).to.deep.equal(expected);
    });
  });
});
