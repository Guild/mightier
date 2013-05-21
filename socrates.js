/*global Socrates Backbone marked */

marked.setOptions({
    gfm      : true,
    sanitize : true
});

window.Socrates = {
    firebaseUrl : 'https://guild.firebaseIO.com/'
};


// Start the app.
$(function () {
    var view = new Socrates.View({
        model : new Socrates.Model(),
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