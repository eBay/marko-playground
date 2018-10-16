/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { expect } from 'chai';
import { mergedConfig } from '../src/config';

describe('mergedConfig', () => {
  [
    {
      should: 'should return empty object if config file not exists',
      mainConfigOrPath: 'not/existing/path',
      localConfigPath: undefined,
      expectedConfigPath: undefined
    },
    {
      should: 'should return config object if config file exists',
      mainConfigOrPath: './test/data/config',
      localConfigPath: undefined,
      expectedConfigPath: './data/config'
    },
    {
      should: 'should return config object if main config file exists, but not local one',
      mainConfigOrPath: './test/data/config',
      localConfigPath: 'not/existing',
      expectedConfigPath: './data/config'
    },
    {
      should: 'should return local config object if only local config file exists',
      mainConfigOrPath: 'not/existing/path',
      localConfigPath: './test/data/localConfig',
      expectedConfigPath: './data/localConfig'
    },
    {
      should: 'should return combined config object if both main and local config exist',
      mainConfigOrPath: './test/data/config',
      localConfigPath: './test/data/localConfig',
      expectedConfigPath: './data/combinedConfig'
    },
    {
      should: 'should return combined config if main config is passed instead of path and local config exist',
      mainConfigOrPath: require('./data/config'),
      localConfigPath: './test/data/localConfig',
      expectedConfigPath: './data/combinedConfig'
    },
    {
      should: 'should return overridden config object if both main and local config exist',
      mainConfigOrPath: './test/data/config',
      localConfigPath: './test/data/localConfigOverride',
      expectedConfigPath: './data/localConfigOverride'
    }
  ].forEach(opts => {
    it(opts.should, () => {
      const config = mergedConfig(opts.mainConfigOrPath, opts.localConfigPath);
      const expectedConfig = opts.expectedConfigPath ? require(opts.expectedConfigPath) : {};

      expect(config).to.deep.equal(expectedConfig);
    });
  });
});
