'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema 


var AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default: 0}
});

var QuestionSchema = new Schema({
	text: String, 
	createdAt: {type: Date, default: Date.now}, 
	answers:[AnswerSchema]
});

//With two schemas that are connected together, we can create and export a question model
var Question = mongoose.model("Question", QuestionSchema);

//We can now import this into our routes file to access it there 
module.exports.Question = Question;
