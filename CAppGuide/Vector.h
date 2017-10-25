#ifndef Vector_H
#define Vector_H

#include "Scalar.h"

template<class Scalar>
    class Vector {
        
        private:
            int Low;
            int High;
            Scalar* Array;
        
        public:
            //Selectors: Getter and Setters
            
            int LowIndex() const;
            int HighIndex() const;
            Scalar& operator[](int k) const;
    }