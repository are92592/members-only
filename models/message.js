var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User", required:true},
    title: {type: String, required: true, maxLength: 150},
    date:  {type: String, required: true, maxLength: 150},
    script: {type: String, value:"What's on your mind?", required:true},
})

module.exports = mongoose.model('Message', MessageSchema);

//uiser:true