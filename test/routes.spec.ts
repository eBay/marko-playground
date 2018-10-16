/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

import { resolve } from 'path';
import { use as chaiUse, expect } from 'chai';
import { SinonStub as Stub, stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
chaiUse(sinonChai);
import { Request } from 'express';
import { Response } from 'marko/express';

import { PlaygroundVm } from '../src/view-model';
import routes, { RouteMatch } from '../src/routes';
import { mockPgs } from './data/mock-pgs';
import { Dependencies } from '../src/dependencies';

const expectedRoutes = ['/some-component1', '/some-component2'];
const expectedPgNames = ['some-component1', 'some-component2'];
const expectedPgTemplates = [
  resolve('templates/mpg-comp.marko.js'),
  resolve('test/examples/comps/comp-multi-file-custom/test/pg/index.marko.js')
];
const mockDeps = (): Dependencies => ({ packagePaths: [], dependencies: [] });
const mockMeta = undefined;
const mockFlags = ['some-flag'];

describe('routes (integration)', () => {
  let routeHandlers: RouteMatch[];

  describe('given no playgrounds', () => {
    before(() => {
      routeHandlers = routes([], mockDeps);
    });

    it('should return only empty root routeHandler', () => {
      expect(routeHandlers).to.have.length(1);
      expect(routeHandlers[0].route).to.equal('/');
      expect(routeHandlers[0].handler).to.be.a('function');
    });
  });

  describe('given playgrounds', () => {
    beforeEach(() => {
      routeHandlers = routes(mockPgs, mockDeps, mockMeta, mockFlags);
    });

    it('should return a list of all components routeHandlers', () => {
      expect(routeHandlers).to.have.length(mockPgs.length + 1);

      const rootRouteHandler = routeHandlers[0];

      expect(rootRouteHandler.route).to.equal('/');
      expect(rootRouteHandler.handler).to.be.a('function');

      routeHandlers.slice(1).forEach(routeHandler => {
        expect(expectedRoutes).to.include(routeHandler.route);
        expect(routeHandler.handler).to.be.a('function');
      });
    });

    describe('component page', () => {
      let mockReq: Partial<Request>;
      let mockRes: Partial<Response>;
      let expectedFixtures: any;

      beforeEach(() => {
        mockReq = {};
        mockRes = { marko: stub() };
        expectedFixtures = mockPgs[0].fixtures;
      });

      it('should have a list of all component names', () => {
        routeHandlers.slice(1).forEach(routeHandler => {
          routeHandler.handler(<Request>mockReq, <Response>mockRes);

          const calledArg = (<Stub>mockRes.marko).args[0];
          const passedVm = calledArg[1];

          expect(passedVm.componentNames).to.have.same.members(expectedPgNames);
        });
      });

      it('should have a list of all fixtures', () => {
        routeHandlers.slice(1).forEach(routeHandler => {
          routeHandler.handler(<Request>mockReq, <Response>mockRes);

          const calledArg = (<Stub>mockRes.marko).args[0];
          const passedVm: PlaygroundVm = calledArg[1];
          const passedPgTemplate = calledArg[0];

          const templateRelPath = resolve(passedPgTemplate.path);
          expect(expectedPgTemplates).to.include(templateRelPath);

          expect(expectedPgNames).to.include(passedVm.componentName);
          expect(passedVm.useCases).to.deep.equal(expectedFixtures);
          expect(passedVm.flags).to.deep.equal(['some-flag']);
          if ('render' in passedVm) {
            expect(passedVm.render).to.be.a('function');
          }

          (<Stub>mockRes.marko).reset();
        });
      });
    });
  });
});
