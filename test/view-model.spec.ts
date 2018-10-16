/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { expect } from 'chai';
import { compListVm, pageVm, playgroundVm } from '../src/view-model';
import { mockPgs } from './data/mock-pgs';
import { Dependencies } from '../src/dependencies';
import { Meta } from '../src/meta';

const genericPg = mockPgs[0];
const deps: Dependencies = {
  packagePaths: ['../common/browser.json'],
  dependencies: ['../styles/style.less']
};

describe('viewModel', () => {
  describe('playgroundVm()', () => {
    describe('given no component/app dependencies', () => {

      describe('given an empty component list', () => {
        it('should return a generic playground VM', () => {
          const vm = playgroundVm(genericPg, []);

          expect(vm.componentName).to.equal('some-component1');
          expect(vm.componentNames).to.be.empty;
          expect(vm.packagePaths).to.be.empty;
          expect(vm.dependencies).to.be.empty;
          expect(vm.render).to.be.a('function');
          expect(vm.useCases).to.deep.equal(require('./data/fixtures'));
        });
      });

      describe('given a component list', () => {
        it('should return a generic playground VM with component list', () => {
          const vm = playgroundVm(genericPg, ['another-component']);

          expect(vm.componentName).to.equal('some-component1');
          expect(vm.componentNames).to.deep.equal(['another-component']);
          expect(vm.packagePaths).to.be.empty;
          expect(vm.dependencies).to.be.empty;
          expect(vm.render).to.be.a('function');
          expect(vm.useCases).to.deep.equal(require('./data/fixtures'));
        });
      });
    });

    describe('given additional dependencies', () => {
      it('should return a VM with dependencies', () => {
        const vm = playgroundVm(genericPg, [], deps);

        expect(vm.packagePaths).to.deep.equal(['../common/browser.json']);
        expect(vm.dependencies).to.deep.equal(['../styles/style.less']);
      });
    });

    describe('given flags', () => {
      it('should return a VM with flags', () => {
        const vm = playgroundVm(genericPg, [], deps, ['some-flag']);

        expect(vm.flags).to.deep.equal(['some-flag']);
      });
    });
  });

  describe('compListVm()', () => {
    describe('given empty component list', () => {
      it('should return a VM with empty component list', () => {
        expect(compListVm([])).to.deep.equal({
          componentNames: [],
          packagePaths: [],
          dependencies: []
        });
      });
    });
    describe('given non-empty component list', () => {
      it('should return a VM with the same component list', () => {
        expect(compListVm(['some-component'])).to.deep.equal({
          componentNames: ['some-component'],
          packagePaths: [],
          dependencies: []
        });
      });
    });
    describe('given additional dependencies', () => {
      it('should return a VM with dependencies', () => {
        expect(compListVm(['some-component'], deps)).to.deep.equal({
          componentNames: ['some-component'],
          packagePaths: ['../common/browser.json'],
          dependencies: ['../styles/style.less']
        });
      });
    });
  });

  describe('pageVm()', () => {
    describe('given playground', () => {
      it('should return page VM merged with playground VM', () => {
        const vm = pageVm(playgroundVm(genericPg, []));

        expect(vm.packagePaths).to.be.empty;
        expect(vm.dependencies).to.be.empty;
        expect(vm.componentNames).to.be.empty;
        expect(vm).to.have.property('componentName').which.is.equal('some-component1');
        expect(vm).to.not.have.property('appName');
        expect(vm).to.not.have.property('appVersion');
      });
    });

    describe('given playground and component list', () => {
      it('should return page VM merged with playground VM with all components', () => {
        const vm = pageVm(playgroundVm(genericPg, ['some-component']));

        expect(vm.packagePaths).to.be.empty;
        expect(vm.dependencies).to.be.empty;
        expect(vm.componentNames).to.deep.equal(['some-component']);
        expect(vm).to.have.property('componentName').which.is.equal('some-component1');
        expect(vm).to.not.have.property('appName');
        expect(vm).to.not.have.property('appVersion');
      });
    });

    describe('given component list', () => {
      it('should return page VM with all components', () => {
        const vm = pageVm(compListVm(['some-component']));

        expect(vm.packagePaths).to.be.empty;
        expect(vm.dependencies).to.be.empty;
        expect(vm.componentNames).to.deep.equal(['some-component']);
        expect(vm).to.not.have.property('appName');
        expect(vm).to.not.have.property('appVersion');
        expect(vm).to.not.have.property('componentName');
      });
    });

    describe('given meta', () => {
      it('should return page VM meta data', () => {
        const meta: Meta = {
          appName: 'app',
          appVersion: '1.0'
        };
        const vm = pageVm(compListVm([]), meta);

        expect(vm.appName).to.equal('app');
        expect(vm.appVersion).to.equal('1.0');
        expect(vm.packagePaths).to.be.empty;
        expect(vm.dependencies).to.be.empty;
        expect(vm.componentNames).to.be.empty;
        expect(vm).to.not.have.property('componentName');
      });
    });
  });

});
