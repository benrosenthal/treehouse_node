'use strict';

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

  var Schema = mongoose.Schema;
  var AnimalSchema = new Schema({
    type: {type: String, default: "goldfish"},
    size: String,
    color: {type: String, default: "golden"},
    mass: {type: Number, default: 0.007},
    name: {type: String, default: "Angela"}
    //This will map to a mongo collection called Animals whenever we serve a document
    });


    //Set size property of each animal dynamically -- pre-save hook -- this is opp to edit a document befre it is saved 
    //Can take advantage of opportunity to implement Mongoose middleware
    AnimalSchema.pre("save", function(next){ //
        if(this.mass >= 100) {
          this.size = "big";
        } else if (this.mass >= 5 && this.mass < 100) {
          this.size = "medium";
        } else {
          this.size = "small";
        }
        next();
    });

    var Animal = mongoose.model("Animal", AnimalSchema);

//mongo will not know about Lawrence until saved to mongo -- right now only exists in application

    var elephant = new Animal({
      type: "elepant",
      color: "gray",
      mass: 6000,
      name: "Lawrence"
    });

    //Now we can create a generical animal into our model by createing an empty obj

    //Static Method can be called on model directly
    //Static methods are helpful when we want to create custom queries from the perspective of the model
    AnimalSchema.statics.findSize = function(size, callback){
      //this == Animal
      return this.find({size: size}, callback)
    }

     //Instance method -- point to instance of docuemnts themselves -- instance methods exists on all documents 
     AnimalSchema.methods.findSameColor = function(callback) {
       //this == document
       return this.model("Animal").find({color: this.color}, callback);
     }

    var animal = new Animal({}); //Goldfish

    //Can't call save before close method -- save is synchronous-- so close will be called immeadiately after before
    //save method can complete -- close data base from within callback in save method

    //Overriding default when adding/creating db collection
    var whale = new Animal({
      type: "whale",
      mass: 190500,
      name: "Fig"
      //did not supply color -- whale should use default
    });


    var animalData = [
      {
        type: "mouse",
        color: "gray",
        mass: 0.035,
        name: "Marvin"
      },
      {
        type: "nutria",
        color: "brown",
        mass: 6.35,
        name: "Gretchen"
      },
      {
        type: "wolf",
        color: "gray",
        mass: 45,
        name: "Iris"
      },
      elephant,
      animal,
      whale
    ];


    Animal.remove({}, function(err) {
      if (err) console.error(err);
      Animal.create(animalData, function(err, animals){
          if (err) console.error(err)
          Animal.findOne({type: "elephant"}, function(err, elephant) {
                elephant.findSameColor(function(err, animals){
                  if (err) console.error(err);
                  animals.forEach(function(animal){
                    console.log(animal.name + " the " + animal.color +
                        " " + animal.type + " is a " + animal.size + "-sized animal.");
                   });
                   db.close(function(){
                     console.log("db connection closed");
                });
            });
        });
    });
});





    //if just call save on animal, will run into problems. save method runs asynchonroulsy, impossible to know which save will winish first
    //if save method called on elephant finishes first db connection will be closed
    //the generic animal wnt be saved, instead we'll place the goldfish save indside
    //the other's callback, and put the db.close() inside the goldfishes's callback
    // to ensure right sequence of events
});
