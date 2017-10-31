#include "bmp.h"

char RGB::ReadBMP32 ( const char *filespec ) {
    
    reader.open( filespec,  ios::binary );
    
    return reader.get();
}