var express = require('express');
var app = express();
var port = 3123;
var exec = require('child_process').exec
app.use(express.static('public'));

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port '+port+'. Open up http://localhost:'+port+'/ in your browser.')
    exec('start chrome http://localhost:'+port, function (err) {
        if(err){ //process error
        }
        else{
            console.log("success open")
        }
    })
  }
});
