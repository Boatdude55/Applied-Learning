#include <iostream>
#include <fstream>
using namespace std;

int main(){
    char ch[100];
    ifstream reader;//object handle for reading image files
    ofstream writer;//object handle for writing image file
    filebuf filebuf;//object handle for creating file buffers
    
    const char * filename = "res/car.bmp";
    
    reader.open(filename, ios::binary);
    
    cout << reader.read(ch, 99) << endl;
}