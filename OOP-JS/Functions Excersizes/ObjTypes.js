/**
 * Object with variable and methods that aren't global,
 * but can be accessed publically through an instance
 * of the object
 * */
var Obj0 = {
//public variable and methods
  publicVar : "public",
  publicMethod : function () {
      return "public";
  }
};

/**
 * Constructor Object that can have private, priveledged, and public scope,
 * can use prototype/_proto
 * can use new key word
 * */
var Obj1 = function () {
    //private
    var prvtVar = "private";
    var prvtMethod = function () {
        return "private";
    };
    
    //privaledged, use this keyword
    this.prvlVar = prvtVar;
    this.prvlMethod = function () {
        return prvtMethod();
    };
    
    //public
    this.pubVar = "public";
    this.pubMethod = function () {
        return "public";
    };
};

var x = new Obj1();

Obj1.prototype.newMethod = function () {
    return "I am a new public method";
};

/**
 * Immediate function
 * */

/**
 * Look up table
 * */