var http= require('http');
var fs = require('fs');//module for file system access
var path = require('path');

http.createServer( function(req, res){
    
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
/*
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request starting...',request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.exists(filePath, function (exists) {

        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
*/