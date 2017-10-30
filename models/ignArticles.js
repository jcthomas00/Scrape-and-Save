const mongoose = require(`mongoose`),
  Schema = mongoose.Schema;

const articleSchema = new Schema({
    article_title : {
        type : String,
        required : true
    },
    article_body : {
        type : String,
        required : true
    },
    article_image : {
        type : String,
        required : true        
    },
    article_url : {
        type : String,
        required : true,
        unique : true    
    },
    article_notes : [{
        type : Schema.Types.ObjectId,
        ref : `ignNotes`
    }]
});

const ignArticles = mongoose.model("ignArticles", articleSchema);
module.exports = ignArticles;