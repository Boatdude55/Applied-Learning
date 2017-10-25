var http= require('http');
var fs = require('fs');//module for file system access
var path = require('path');

http.createServer(function(req, res){
    console.log('request startin...', req.url);
    
    var filePath = '.' + req.url;
    if(filePath == './'){
        filePath = './index.html';
    }
    
    var extname = path.extname(filePath);//returns the extention of the path
    var contentType = 'text/html';
    switch(extname){
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    
    fs.exists(filePath, function(exists){
        
        if(exists){
            fs.readFile(filePath, function(error, content){
                if(error){
                    res.writeHead(500);
                    res.end();
                }else{
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                }
            });
        }else{
            res.writeHead(404);
            res.end();
        }
    });
    
}).listen(process.env.PORT, process.env.IP);
