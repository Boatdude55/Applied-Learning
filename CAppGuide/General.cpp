#include "General.h"

bool StrEmpty(const char* S){
    return *S == 0;
}

int Digits(int x){
    //Possible to replace with itoa
    int p = 1; double n = 10;
    
    while (abs(x) >= n){
        
        ++p;
        n *= 10;
    }
    
    if (x < 0){
        
        ++p;
        
    }
    
    return p;
    
}

void Pause(const char* Prompt){
    
    cout << Prompt << flush;
    cin.get();
    
}

int min(int t1, int t2){
    
    return (t1 < t2 ? t1 : t2);
    
}