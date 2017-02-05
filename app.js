'use strict';

var express = require("express");
var app = express();


//first peice of middleware
app.use(function(req, res, next){
  console.log("The leaves on the are", req.query.color);
  next();
})


var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Express server is listening on port ", port);
});
