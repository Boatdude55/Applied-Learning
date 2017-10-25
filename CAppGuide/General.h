/**
 * Prototypes and some definitions for the base of this project
 * 
 **/

#include <cstdio>
#include <cmath>
#include <cstdlib>
#include <iostream>

#ifndef General_H
#define General_H

using namespace std;

#define This (*this) //macro for object self pointer

bool StrEmpty( const char* S);

#define EmptyStr ""

const char Blank = ' ';

void Pause(const char* Prompt = "\nPress any key...\n\n");

int Difits(int x);

int min(int t1, int t2);

// Defined below are the basic operations

    template<class Operand>
        int Sign(const Operand& x){
            
            return (x < 0 ? -1: x == 0 ? 0 : 1);
            
        }
    
    template<class Operand>
        Operand operator+(const Operand& x) {
            
            return x;
            
        }
        
    template<class Operand>
        bool operator!=(const Operand& x, const Operand& y){
            
            return !(x == y);
            
        }
        
    template<class LOperand, class ROperand>
        LOperand& operator+=(LOperand& x, ROperand& y){
            
            return x = x + y;
            
        }
        
    template<class LOperand, class ROperand>
        LOperand& operator-=(LOperand& x, ROperand& y){
            
            return x = x - y;
            
        }
        
    template<class LOperand, class ROperand>
        LOperand& operator/=(LOperand& x, ROperand& y){
            
            return x = x / y;
        }
        
    template<class LOperand, class ROperand>
        LOperand& operator*=(LOperand& x, ROperand& y){
            
            return x = x * y;
        }
        
    template<class LOperand, class ROperand>
        bool operator==(LOperand& x, ROperand& y){
            
            return (x == y);
            
        }
        
    template<class LOperand, class ROperand>
        bool operator<(LOperand& x, ROperand& y){
            
            return (x > y);
            
        }
        
    template<class LOperand, class ROperand>
        bool operator>(LOperand& x, ROperand& y){
            
            return (x < y);
            
        }
        
    template<class LOperand, class ROperand>
        LOperand operator%=(LOperand& x, ROperand& y){
            
            return x = x % y;
            
        }
        
    template<class LOperand, class ROperand>
        LOperand operator^=(LOperand& x, ROperand& y){
            
            for(int i=1; i<=y; i++){
                
                x *= x;
            }
         
            return x;   
        }

//Exceptions

    typedef enum {
        UnknownError, DivideError, EndOfFile,
        FormatError, IndexError, IOError,
        MathError, OtherError, OurOfMemortError
    } ExceptionType;

    class Exception {
        public: 
            ExceptionType Type;
            Exception(ExceptionType T = UnknownError){

                Type = T;

            }

    };

#endif