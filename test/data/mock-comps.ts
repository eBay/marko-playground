/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { Component } from '../../src/components';
import Tag = require('marko/src/compiler/taglib-loader/Tag');

const tag = new Tag('./some-component');
tag.name = 'some-component';

export const mockComps: Component[] = [{
  path: './some-component',
  render: () => {},
  tag
}];
