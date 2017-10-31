#include <png.h>
#include <cstdio>

//Reading Files

Setup ( File * file) {
    
    if(!file){
        return ERROR;
    }
    
    fread(header, 1, 8, file);
    
    is_png = !png_sig_cmp(header, 0, number);
    if(!is_png){
        return (NOT_PNG);
    }
}