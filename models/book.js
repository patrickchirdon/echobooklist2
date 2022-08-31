var mongoose = require("mongoose");


//SCHEMA SETUP
var  bookSchema = new mongoose.Schema({
    name: String,
    price: String,
    amazonLink: String,
    author: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    postAuthor: {
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      } ,
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("Book", bookSchema);