/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { expect } from 'chai';
import { componentFiles, Dependencies } from '../../src/dependencies';
import { resolve } from 'path';

describe('componentFiles()', () => {
  describe('given no component files found', () => {
    it('should return empty dependencies', () => {
      const mockGetComponentFiles = () => {};
      const expected: Dependencies = {
        packagePaths: [],
        dependencies: []
      };

      expect(componentFiles('', mockGetComponentFiles)).to.deep.equal(expected);
    });
  });

  describe('given component package found', () => {
    it('should return that package within dependencies', () => {
      const mockGetComponentFiles = () => ({
        package: 'some-package',
        styles: []
      });
      const expected: Dependencies = {
        packagePaths: [ resolve('some-package') ],
        dependencies: []
      };

      expect(componentFiles('', mockGetComponentFiles)).to.deep.equal(expected);
    });
  });

  describe('given component file found', () => {
    it('should return that file within dependencies', () => {
      const mockGetComponentFiles = () => ({
        file: 'some-file',
        styles: []
      });
      const expected: Dependencies = {
        packagePaths: [],
        dependencies: [ resolve('some-file') ]
      };

      expect(componentFiles('', mockGetComponentFiles)).to.deep.equal(expected);
    });
  });

  describe('given component styles found', () => {
    it('should return that styles within dependencies', () => {
      const mockGetComponentFiles = () => ({
        styles: [ 'some-styles' ]
      });
      const expected: Dependencies = {
        packagePaths: [],
        dependencies: [ resolve('some-styles') ]
      };

      expect(componentFiles('', mockGetComponentFiles)).to.deep.equal(expected);
    });
  });

  describe('given component dependencies found', () => {
    it('should return that dependencies', () => {
      const mockGetComponentFiles = () => ({
        package: 'some-package',
        file: 'some-file',
        styles: [ 'some-styles' ]
      });
      const expected: Dependencies = {
        packagePaths: [ resolve('some-package') ],
        dependencies: [ resolve('some-styles'), resolve('some-file') ]
      };

      expect(componentFiles('', mockGetComponentFiles)).to.deep.equal(expected);
    });
  });
});
