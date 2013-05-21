/*global mightier Backbone marked */

marked.setOptions({
    gfm      : true,
    sanitize : true
});

window.mightier = {
    firebaseUrl : 'https://guild.firebaseIO.com/'
};


// Start the app.
$(function () {
    var view = new mightier.View({
        model : new mightier.Model(),
        el    : $('html')
    })
        .render();

    Backbone.history.start();
});