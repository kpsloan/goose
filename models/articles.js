var mongoose = require("mongoose");
var Schema = mongoose.Schema;


// Create a new UserSchema object
var ArticleSchema = new Schema({

	_id: {
		type: String
	  },
    title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	summary: {
		type: String,
		default: "Summary unavailable."
	},
	img: {
		type: String,
		
	},
	issaved: {
		type: Boolean,
		default: false
	},
	status: {
		type: String,
		default: "Save Article"
	},
	created: {
		type: Date,
		default: Date.now
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});

// Article.index({title: "text"});



var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;