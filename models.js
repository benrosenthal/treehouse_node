'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema 

var sortAnswers = function(a, b) {
	//- negative a before b
	//0 no chnage
	//+ positive a after n
	if(a.votes === b.votes){
		return b.updatedAt - a.updatedAt;
	}
	return b.votes - a.votes;
}



var AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default: 0}
});

//apply updates to an answer document and we also want the answers update to be current time
//Instance mthoed becuase we can it directly on the onject when we want to update it 
//AnswerSchema.methods.update = function(updates, callback) {}
//Line 28 can also be written like this
AnswerSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	//now need to save parent doc -- in other words, the question associated with the answer
	//to access question, can use parent method
	this.parent().save(callback);
});

//Vote Instance Method -- To help with translating strings from the URL to numbers that move the count up of r downm
AnswerSchema.method("vote", function(vote, callback) {
	if(vote === "up") {
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	this.parent().save(callback);
});

var QuestionSchema = new Schema({
	text: String, 
	createdAt: {type: Date, default: Date.now}, 
	answers:[AnswerSchema]
});

QuestionSchema.pre("save", function(next){
	this.answers.sort(sortAnswers); //pass in sort founction int the sort method
	next();
});

//With two schemas that are connected together, we can create and export a question model
var Question = mongoose.model("Question", QuestionSchema);

//We can now import this into our routes file to access it there 
module.exports.Question = Question;
