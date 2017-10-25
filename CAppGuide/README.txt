I started this folder in order to work on my C++ skills in a less pedagogical way

It is a set of applications meant to...

-   Apply Object Oriented Programming methods to scientific applications
    
    I learned how to...
    
        1)  Organize software like the underlying higher mathematics.
        2)  To make programs look like the mathematical descriptions of the algorithms they implement.
        3)  Design a software toolkit based on 1 and 2.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

1 - 2)  Organize software like the underlying higher mathematics

        I took advantage of mathematical notation in order to comunicate complex ideas.
    
        I used algebraic structure of higher mathematics as a way analyze arguments and synthesize solutions
        to mathematical problems.
    
3)  Design a software toolkit based on 1 and 2

    I gained knowledge of how to design and use a sofware toolkit, focused on Object Oriented Programming fundamentals.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
Overview: I gained insight into how I may use Object Oriented Programming in a scientific context

    Foundation
        -   vector algebra
        -   matrix algebra
        -   polynomial algebra
        -   Solve linear equations
        -   Solve Non linear equations
        -   Solve eiganvalue problems
        
    Applied templates and exception handling
    
        Templates
            
            1)  Way to create multiple overloaded functions at one time
            
            2)  Some Meta Programming
                -   Improve the speed of your programs by doing extra work in the compile phases, as the example shows.
                    In addition to that, it turns out that you can actually use the same technique to provide convenient
                    syntax for complicated operations while allowing them to achieve high performance
                    (matrix-manipulation libraries, for instance, can be written using templates). 
                    
            EX) 
                    Header File: Holds prototypes
                    
                template<class Number>
                    Number f(Number x);
                    
                    library File: Holds definitions
                    
                #include 'Template.H"
                
                template<class Number>
                Number f(Number x) {
                    return x + 32; }
                    
                double f(double x) {
                    return x + 1.; }
                    
                void UseTemplate() {//This block here instantiates the supported types for the function to the compiler
                    f (1);          //Other wise the instances would be dealt with at runtime
                                    //This way takes advantage of meta programming 
                    f (' l' ); }    //and puts some of the workload on the compiler
                
                    Main file: Holds main function definition
                    
                #include 'Template.H"
                
                void main() {
                    cout « "\nf(S5) , « f(S5)
                         « "\nf( 'A') " « f( 'A')
                         « "\nf(S.5) , « f(S.5); 
                    
                  
                }
                
        Exception handling
            Try vs If
            - Exception handling is much more efficient because it also allows you to deal with memory, and unknown errors
                it also gives more information for debugging
            
    Built on Chrome
        -   Used Chromes Native Client Module in order to access gui/ which is the browser in chrome
        -   Keep in mind node js