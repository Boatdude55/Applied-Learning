#ifndef Scalar_H
#define Scalar_H

#include "General.h"

#define Double 0
#define Int 1

template<class Scalar>
    int Type(const Scalar& t);
    
template<class Scalar>
    char* TypeName(const Scalar& t);
    
template<class Scalar>
    char* DefaulFormat(const Scalar& t);
    
template<class Scalar>
    char* ForShow(const Scalar& t, char&* Format = NULL);
    
template<class Scalar>
    unsigned Show(const Scalar& t, char* Format = NULL);
    
//Mathematics

double abs (const double& x);
double real (const double& x);
double imag(const double& x);
double conj (const double& x);

//void MakeRandom(double& x);
//void MakeRandom ( int& k);