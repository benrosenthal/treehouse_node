'use strict';

var express = require("express");
var router = express.Router();

// GET /listofconcerts ==> LIKE GET LIST OF CONCERTS
//route for list of concerts in a given cit
router.get("/", function(req, res){
  res.json({response: "You sent me a GET request"});
});

// POST /listofconcerts/city
router.post("/", function (req, res) {
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});

// GET listofconcerts/:geo_id
//Route for concerts within same physcial desigantion
router.get("/:geoID", function(req, res) {
  res.json({
    response: "You sent me a GET request for ID " + req.params.geoID
  });
});

// POST /listofconcerts/city
router.post("/:geoID", function (req, res) {
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});



// PUT /questions/:id/answers/:
router.put("/:qID/listofconcerts/:aID", function (req, res) {
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});

// PUT /questions/:id/answers/:
router.post("/:qID/listofconcerts/:aID", function (req, res) {
  res.json({
    response: "You sent me a DELETE request to /listofconserts",
    body: req.body
  });
});


module.exports = router;
