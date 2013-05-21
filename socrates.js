/*global Mightier Backbone marked */

marked.setOptions({
    gfm      : true,
    sanitize : true
});

window.Mightier = {
    firebaseUrl : 'https://mightier.firebaseIO.com/'
};


// Start the app.
$(function () {
    var view = new Mightier.View({
        model : new Mightier.Model(),
        el    : $('html')
    })
        .render();

    Backbone.history.start();
});


// Analytics
// ---------

var dev = window.location.hostname === 'localhost';
window.analytics.initialize({
    'Segment.io'       : dev ? ''         : 'dthect0ayc',
    'Google Analytics' : dev ? ''         : '',
    'Mixpanel'         : dev ? ''         : '',
    'KISSmetrics'      : dev ? ''         : ''
});