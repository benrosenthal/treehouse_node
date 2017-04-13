'use strict';

var express = require("express");
var router = express.Router();
var Question = require("./models").Question;

router.param("geoID", function(req, res, next, id) {
//call back will be executed when geoId is present
    Question.findById(id, function(err, doc) {
      if(err) return next(err);
      if(!doc){
        //remember to set error status on error obj
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
      }
      //if exists let's set it on the req onj so it can be used in other middleware and route handlers that receive this req
      req.question = doc;
      return next();
  });

});

// GET /listofconcerts ==> LIKE GET LIST OF CONCERTS
//route for list of concerts in a given cit
// router.get("/", function(req, res){
//   Question.find({}, null, {sort: {createdAt: -1}} function(err, questions) {
//       if(err) return next(err);
//       res.json(questions);
//   });
//   res.json({response: "You sent me a GET request"});
// });

// "/" the above route can also be written this way:
router.get("/", function(req, res, next) {
    Question.find({})
                .sort({createdAt: -1})
                .exec(function(err, questions) {
                  if(err return next(err);
                  res.json(questions);
                });
});

//To create a new question document from the incoming JSON on the req body we can pass it in directly to model constructor

// POST /listofconcerts/city
router.post("/", function (req, res, next) {
  var question = new Question(req.body);
  question.save(function(err, question) {
      if(err) return next(err);
      res.status(201);
      res.json(question); 
  });
});

// GET listofconcerts/:geo_id
//Route for concerts within same physcial desigantion
// router.get("/:geoID", function(req, res, next) {
//   Question.findById(req.params.geoID, function(err, doc) {
//       if(err) return next(err);
//       res.json(doc);
//   });
// });  

//Another way to write line 45 route
//Better way to do: Express allows use to trigger a handler whenever a url par
//is present. in this case if geoID exists. We can pre-lod the question document 
//in the handler so it will be present on any matching route
//we don't need to query database anymore becuase the param handler is going to 
// be both querying the database or handle the errors
router.get("/:geoID", function(req, res, next){
    res.json(req.question);
});  

// POST /listofconcerts/city
router.post("/:geoID", function (req, res) {
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});

router.post("/:geoID/concerts", function(req, res, next) {
  req.question.concerts.push(req.body);
  req.qestions.save(function(err, question) {
      if(err) return next(err);
      res.status(201);
      res.json(question); 
  });
});


// PUT /questions/:id/answers/:
router.put("/:qID/concerts/:aID", function (req, res) {
  res.json({
    response: "You sent me a DELETE request to /concerts",
    //questionID: req.params.qID
    //AnswerID: req.params.qID
    body: req.body
  });
});

// PUT /questions/:id/answers/:
router.delete("/:qID/listofconcerts/:aID", function (req, res) {
  res.json({
    response: "You sent me a DELETE request to /listofconserts",
    body: req.body
  });
});


module.exports = router;
