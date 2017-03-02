var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArcticleSchema = new Schema({
  title:{
    type: String;
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId
    ref: "Comments"
  }
});

var Article = mongoose.model("Article". ArticleSchema);

module.exports = Article;
