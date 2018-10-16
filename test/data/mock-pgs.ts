/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { Playground } from '../../src/playground';

export const mockPgs: Playground[] = [
  {
    compName: 'some-component1',
    compPath: './some-component1',
    compRenderer: './some-renderer1',
    render: () => {},
    compTemplate: './some-component1/template',
    fixtures: require('./fixtures')
  },
  {
    compName: 'some-component2',
    compPath: './some-component2',
    compRenderer: './some-renderer2',
    render: () => {},
    compTemplate: './some-component2/template',
    customTemplate: './test/examples/comps/comp-multi-file-custom/test/pg/index.marko.js',
    fixtures: require('./fixtures')
  }
];
