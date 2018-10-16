/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

// tslint:disable:no-console

import { resolve, dirname } from 'path';
import { buildTaglibLookup } from 'marko/src/compiler';
import Tag = require('marko/src/compiler/taglib-loader/Tag');
import { existsSync } from 'fs';

export interface Component {
  path: string;
  render: Render;
  tag: Tag;
}

export type Render = (vm: object, out: any) => void;

const tagRenderFunc = (rendererPath: string, fromTemplate: boolean = false): Render | Error => {
  const renderer = existsSync(rendererPath) ? require(rendererPath) : {};
  const renderProp = fromTemplate ? '_' : 'renderer';

  const renderFn = renderer.render && renderer.render.bind(renderer);
  const rendererFn = renderer[renderProp] && renderer[renderProp].bind(renderer);

  return renderFn || rendererFn || Error(`Error: can't render from "${rendererPath}"`);
};

const tagTemplateRenderFunc = (templatePath: string): Render | Error =>
  tagRenderFunc(templatePath, true);

const toRenderableComponent = (tag: Tag): Component | Error => {
  const renderer = tag.renderer || tag.template;

  if (!renderer) {
    return Error(`Error: component "${tag.name}" has neither renderer nor a template.`);
  }

  const render = tag.renderer ? tagRenderFunc(tag.renderer) : tagTemplateRenderFunc(tag.template);

  if (render instanceof Error) {
    return render;
  }

  return {
    path: dirname(renderer),
    render,
    tag
  };
};

export default function (componentsRootDir: string = ''): Component[] {
  const componentsRootPath = resolve(componentsRootDir);
  const notExternal = (tag: Tag): boolean => !tag.dir.includes('node_modules');
  const inSubdirs = (tag: Tag): boolean => tag.dir.includes(componentsRootPath);
  const allTags: Tag[] = buildTaglibLookup(componentsRootPath).getTagsSorted();
  const tags: Tag[] = allTags.filter(notExternal).filter(inSubdirs);

  return tags.reduce(renderableComponentsReducer, []);
}

function renderableComponentsReducer(components: Component[], tag: Tag): Component[] {
  const renderableComponent: Component | Error = toRenderableComponent(tag);

  if (renderableComponent instanceof Error) {
    console.error(renderableComponent);
    return components;
  }

  return components.concat(renderableComponent);
}
