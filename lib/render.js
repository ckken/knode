/**
 * Created by ken.xu on 14-2-10.
 */
var views = require('co-views');

// setup views mapping .html
// to the swig template engine

module.exports = views(C.view, {
    map: { html: 'swig' }
});