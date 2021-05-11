var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    date_and_time: {type: new Date()},
    user: {type: Schema.Types.ObjectId, ref:"User", user:true},
    title: {type: String, required: true, maxLength: 50},
    script: {type: String, required:true, maxLength: 400},
})

module.exports = mongoose.model('Message', MessageSchema);

/* 

mongoose.schema Message = {
    date_and_time: new Date() object
    time_since_post: current date - original date, round to whatevt is the closest to 0
    user: Schema.user (user id) (user.name and user.username)
    title: String
    script: String
}

*/