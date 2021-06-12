var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    /*date_and_time: {type: new Date()},
    user: {type: Schema.Types.ObjectId, ref:"User", user:true},*/
    title: {type: String, required: true, maxLength: 150},
    script: {type: String, value:"What's on your mind?", required:true, maxLength: 400},
})

module.exports = mongoose.model('Message', MessageSchema);

