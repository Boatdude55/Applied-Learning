//define is only available through AMD, implemented in this case by require js
define(['exports'], function(exports){
    var bar = exports.log = function(){
        console.log('bar.log was called');
    };
});

/*
//This is the CommonJS implementation of exporting

module.exports.log = function(){
        console.log('bar.log was called');
    };
*/