#include <node.h>

namesapce demo {
    
    using v8::FunctionCallbackInfo; //class in v8 namespace that gives access to callback info
    using v8::Isolate; //class for instancing v8 engine
    using v8::Local; //class for implementing Local scope of v8 javascript "Object"
    using v8::Object; //class implementing Javascript objects
    using v8::String; //class implementing Javascript string also parent of primitive class
    using v8::Value; //super class; derived from objects, primitive, and external class
    
    void Method( const FunctionCallbackInfo<Value>& args ) {
        
        Isolate * isolate = args.GetIsolate();
        args.GetReturnValue().Set( String::NewFromUtf8(isolate, "world"));

    }
    
    void init( Local<Object> exports ) {

        NODE_SET_METHOD( exports, "hello", Method);

    }
    
    NODE_MODULE( addon, init )
}