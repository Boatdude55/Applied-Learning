define([],function(){
    var foo = function (){
        console.log('foo was called');
    };
    return foo;
    //This illustrates how revealing pattern is still a part of module loading
});

/*
//CommonJS implementation
module.exports = function(){
        console.log('foo was called');
    };
*/