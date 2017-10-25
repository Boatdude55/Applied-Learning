#include "General.h"
#include <csignal>

void f(double a){
    try{
        cout << "(1/a)^2 = " << (1/a)*(1/a);
    }catch(...){
        cerr << "\nwhile executing f(a) with a =" << a;
        throw;
    }
}

int main(){
    double a;
    for(;;){
        try{
            cout << "\n\nInput a = "; cin >> a; f(a);
        }catch(...){
            cout << "\nwhile demonstrating MSP error handling.";
        }
    }
    return 0;
}