const mongoose = require(`mongoose`),
  Schema = mongoose.Schema;

const notesSchema = new Schema({
    note_title : {
        type : String,
        required : true
    },
    note_body : {
        type : String,
        required : true
    }
});

const ignNotes = mongoose.model(`ignNotes`, notesSchema);
module.exports = ignNotes;