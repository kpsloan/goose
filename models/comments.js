var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create a new NoteSchema object
var Comment = new Schema({
	title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }, 
	body: {
        type: String,
        required: true,
	}
});

//var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;