#include "Scalar.h"

int Type (const double& t){
    return Double;
}

int Type (const int& t){

    return Int;

}

char* TypeNameArray[] = { "double",
                            "int"};
                            
template<class Scalar>
    char* TypeName(const Scalar& t){

        return TypeNameArray[Type(t)];

    }

template<class Scalar>
    char* ForShow(const Scalar& t, char* Format){
        
        if (Format == NULL) Format = DefaultFormat(t);
            
        char* S;
        try { S = new char[80]; }
        catch(xalloc) {
            cout << "\nException OutOfMemory" <<
                    "\nwhile executting ForShow(t, Format)" << endl;
            
            throw(Exception(OutOfMemory)); 
            
        }
            
            int n = sprintf(S,Format,t); 
            
            if(n < 1 || n > 80) {
                
                cerr << "\nException FormatError" <<
                        "\nwhile executing ForShow(t, Format)" <<
                        "\nwith t =" << Scalar(t) <<
                        " and Format = \'" << Format << "\'" <<
                        "\n -- you may have corrupted the heap--" << endl;
                        
                Pause();
                
                throw(Exception(FormatError));
                
            }
                return S;
}

template<class Scalar>
    unsigned Show(const Scalar& t, char* Format){
        
        try {
            
            char* S;
            S = ForShow(t, Format);
            cout << S;
            unsigned n = strlen(S);
            delete S;
            return n;
        
        } catch (...){
            cerr << "\nwhile attempting to execure Show(t, Format)" <<
                    "\nwith t = " << Scalar(t) <<
                    " and Format = \"" << Format << '\"';
                    throw;
        }
    }
    
char* DefaultFormatArray[] = {
    "% -#8.2g ", "% 6i " 
};

template<class Scalar>
    char* DefaultFormat(const Scalar& t){
        
        return DefaultFormatArray[Type(t)];
    }