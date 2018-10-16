/*
 * Copyright 2018 eBay Inc.
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 *
 */

module.exports = {
    onCreate() {
        this.state = {
            count: 0
        }
    },
    onMount() {
        console.log('Mounted in the browser!');
    },
    increment() {
        this.state.count++;
    }
};
