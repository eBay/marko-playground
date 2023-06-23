[![Build Status](https://api.travis-ci.org/eBay/marko-playground.svg?branch=master)](https://travis-ci.org/eBay/marko-playground)

# marko-playground

This project is a development utility for Marko UI components. On launch, it automatically detects all components in your Marko application and allows you to browse through them, rendering all declared use cases or states. 
Scenarios can be written in fixtures that represent the backend responses or props from the parent component.
As a result, component development becomes way faster, regression testing easier and visual defects can be spotted early.

![Marko Playground screenshot](https://user-images.githubusercontent.com/2737310/44096771-5c383430-9fdc-11e8-84fa-4d150f336bab.png)

## Getting started

First, add marko-playground to your project by running the following command:

```bash
yarn add --dev @ebay/marko-playground
#or
npm i --save-dev @ebay/marko-playground
```

Now you can start the playground via

```bash
yarn marko-playground
#or
npm run marko-playground
```

## Predefined component props (inputs)
When marko-playground detects a UI component, it reads its props from the directory `<component>/test/fixtures`. If no prop (or fixture) has been found, it falls back to empty props and renders the component accordingly.

Additional props can be defined with the following directory structure (which is also used by [marko-tester](https://github.com/oxala/marko-tester)):

```json
<component>/test/
            ⤷ fixtures/
               ⤷ default.json
               ⤷ another-use-case.json
```

### Example of default.json 
```json
{
    "viewModel": {
        "title": "default title"
    }
}
```

## Configuration

The marko-playground tool can be configured by adding a `test/playground/config.json` to your project. 
If no file is found, the following default configuration is used instead:

```js
{
  // Playground will listen on this port, override it with environment variable PORT:
  "port": 8080,

  // Widget components will be searched starting from this directory,
  // override with COMPONENTS_ROOT_DIR
  "componentsRootDir": "./src/components",

  // Widget playground's template will be searched in this directory relative 
  // to component's directory, override with PLAYGROUND_DIR:
  "playgroundDir": "test/playground",

  // Lasso config, override with LASSO_CONFIG indicating local lasso config JSON file:
  "lasso": {
    "plugins": [
      "lasso-less",
      "lasso-marko"
    ],
    "outputDir": "static",
    "bundlingEnabled": false,
    "minify": false,
    "fingerprintsEnabled": false
  }
}
```

## Lasso flags support
You can pass flags to lasso page by setting environment variable `FLAGS`, for example: `FLAGS=skin-ds6,mobile`

## Custom playgrounds
If you don't like the standard component template used in playground, you can use your own. 
Simply put it in you component's `test/playground` directory and name it `index.marko` or `template.marko`.
You can always change the location of the template by changing the config property `playgroundDir` or environment variable `PLAYGROUND_DIR`. 
[Example](test/examples/comps/comp-multi-file-custom/test/pg/index.marko)

## Components discovery

The UI component detection is based on Marko's configuration and respect's the configuration's `tags-dir` and `<component>/renderer` property.

Usually, you have a `marko.json` in your project (or rely on the defaults which is the `components` directory). The marko file looks like this:
```json
{
    "tags-dir": "./components"
}
```

If you have a separate component project, your `marko.json` should look similar to this:
```json
{
    "<component-name>": {
        "renderer": "./component-dir"
    }
}
```

That file usually resides in the root directory ([marko documentation](https://markojs.com/docs/custom-tags/#markojson-syntax).)

## Debugging
For more diagnostic messages set environment variable `DEBUG` to truthy value like `DEBUG=1`.

## Development
Git clone this repo, then install everything:

```bash
yarn 
#or 
npm install
```

Then start playground with test components:
```bash
yarn start
#or
npm start
```

Tests can be executed via:
```bash
yarn test
#or
npm test
```

## CI
https://travis-ci.org/eBay/marko-playground

## Licence

Copyright 2018 eBay Inc.
Developer(s): Timur Manyanov 

Use of this source code is governed by an MIT-style
license that can be found in the LICENSE file or at
https://opensource.org/licenses/MIT.
