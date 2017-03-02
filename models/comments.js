var moongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment:{
    type: String
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comments;
