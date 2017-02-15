'use strict';

var mongoose = require("mongoose");
//One this called is can monitor the status of the request through Mongoose's connect onj
mongoose.connect("mongodb://localhost:27017/sandbox");

var db = mongoose.connection;

db.on("error", function(err){
  console.error("connection error:", err);
});

//Will only fire event first time even happens
db.once("open", function(){
  console.log("db connection succesful");
  // All database communication goes here

  var Schema = mongoose.Schema;
  var AnimalSchema = new Schema({
    {type: String, default: "goldfish"},
    {size: String, default: "small"},
    {color: String, default: "golden"},
    {mass: Number, default: 0.007},
    {name: String, default: "Angela"}
    //This will map to a mongo collection called Animals whenever we serve a document
    });

    var Animal = mongoose.model("Animal", AnimalSchema);

//mongo will not know about Lawrence until saved to mongo -- right now only exists in application

    var elephant = new Animal({
      type: "elepant",
      size: "big",
      color: "gray",
      mass: 6000,
      name: "Lawrence"
    });

    //Now we can create a generical animal into our model by createing an empty obj

    var animal = new Animal({}); //Goldfish

    //Can't call save before close method -- save is synchronous-- so close will be called immeadiately after before
    //save method can complete -- close data base from within callback in save method

    //Ask animal model to empty animals collection b4 save anything
    Animal.remove({, function(){
      
    }});

    elephant.save(function(err){
      if (err) console.error("Save Failed.", err);
      animal.save(function(err) {
        if (err) console.error("Save Failed.", err);
        db.close(function(){
          console.log("db connection closed");
        });
      });
    });

    //if just call save on animal, will run into problems. save method runs asynchonroulsy, impossible to know which save will winish first
    //if save method called on elephant finishes first db connection will be closed
    //the generic animal wnt be saved, instead we'll place the goldfish save indside
    //the other's callback, and put the db.close() inside the goldfishes's callback
    // to ensure right sequence of events
});
