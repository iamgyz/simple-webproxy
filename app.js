/*
Author : GYZheng
Date : 2015.05.22
Feature: Simple web proxy service, enable you to do the proxy via website.
Currently support "GET" mehod.
*/
var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')

var app = express();
var server = http.createServer(app);
var port = 8888;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
/*
    Defalut route
    route to the ./public/index.html
*/
app.get('/',function(request, response){    
    path = 'index.html';
    response.sendFile(path, {root: './public'});    
});
/*
    pagejs route
*/
app.get('/pagejs.js',function(request, response){    
    path = 'pagejs.js';
    response.sendFile(path, {root: './'});    
});
/*
    proxy route
*/
app.get('/url/:url',function(request,response){
    var url = request.params.url;
    console.log("In get");
    console.log(url);
    proxy(url,function(body){
            //console.log(body);
            response.end(body);
    });
});

app.post('/',function(request, response){
    console.log("In post");
    console.log(request.body);
    url = request.body.url;
    proxy(url,function(body){
            //console.log(body);
            response.end(body);
    });
});

/*
    Start the proxy server
*/
server.listen(port,'0.0.0.0',function(){
    console.log('Server run on '+port);
});



function proxy(url,callback){
    request({url:url},function(err,response,body){
        //check err state (not implement yet)
        /*
            inject my script
            set prefix as global variable
        */        
        var prefix = url.substr(0,url.lastIndexOf('/'));
        //if prefix <= https:/
        if(prefix.length<8) prefix = url;
        var injection = "<script>var webProxy_referer='"+prefix+"'</script><script src='/pagejs.js'></script>";     
        /*
            Insert the script into <head></head> if the tag exist
        */
        try{
            var tmp = body.split("<head>");
            body = tmp[0] + "<head>" + injection +tmp[1];
            console.log("Inject script! =>"+url);
        }catch(e)
        {            
            console.log("No <head> tag found! =>"+url);
        }
        callback(body);
    });
}