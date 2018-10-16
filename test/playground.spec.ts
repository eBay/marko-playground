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
import { customTemplateInPath } from '../src/playground';

describe('playground (integration)', () => {
  describe('given component without custom playground', () => {
    it('should return undefined', () => {
      expect(customTemplateInPath()).to.equal(undefined);
    });
  });

  describe('given component with custom playground', () => {
    describe('given no path', () => {
      it('should return a custom playground template', () => {
        const playground = customTemplateInPath();
        const expectedPlayground = undefined;

        expect(playground).to.equal(expectedPlayground);
      });
    });

    describe('given playground path', () => {
      it('should return path to its template', () => {
        const playgroundPath = resolve('./test/examples/comps/comp-multi-file-custom/test/pg');
        const playground = customTemplateInPath(playgroundPath);
        const expectedPlayground = resolve('./test/examples/comps/comp-multi-file-custom/test/pg/index.marko');

        expect(playground).to.equal(expectedPlayground);
      });
    });
  });
});
