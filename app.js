'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

//will configure the middleware the give us colorful status codes
app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require("mongoose");
//Once called can monitor the status of the request through Mongoose's connect obj

//NOT FROM TREEHOUSE -- to solve promise deprecation warning
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/sandbox");

var db = mongoose.connection;

db.on("error", function(err){
  console.error("connection error:", err);
});

//Will only fire event first time even happens
db.once("open", function(){
  console.log("db connection succesful");
  // All database communication goes here
});

app.use("/listofconcerts", routes);

// 404 Not Found and forward to error handler
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Express server is listening on port ", port);
});
