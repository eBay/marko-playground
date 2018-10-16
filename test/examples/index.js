/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

require('marko/node-require'); // Allow Node.js to require and load `.marko` files

var express = require('express');
var markoExpress = require('marko/express');
var template = require('./index.marko');
var comp = require('./comps/comp-multi-file');

var app = express();

app.use(markoExpress()); //enable res.marko(template, data)

app.use(require('lasso/middleware').serveStatic());
require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: 'static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: false,
    minify: false,
    fingerprintsEnabled: false
});

app.get('/', function (req, res) {
    // comp
    //     .renderSync({})
    //     .appendTo(document.body);

    const options = {
        pageName: 'test',
        packagePath: require('path').join(process.cwd(), './test/examples/comps/comp-single-file/index.marko')
    };

    require('lasso').getDefaultLasso().lassoPage(options).then(result => {
        console.log('Lasso:', result.getOutputFiles());
    });

    res.marko(template, {
        name: 'Frank',
        count: 30,
        colors: ['red', 'green', 'blue'],
        comp: comp
    });

});

app.listen(8000);
