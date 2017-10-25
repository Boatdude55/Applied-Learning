
define(['./foo', './bar'], function(foo, bar){
    bar.log();
    foo();
    
});

/*
//Testing this code the problem with commonJS is much more clear, JS is scripted language, and there 
//seems to be no way to make sure the dependency is loaded before its used
//RequireJS is best because it makes sure dependencies are loaded by using callback functions
var bar = require("./bar");

var foo = require("./foo");
*/