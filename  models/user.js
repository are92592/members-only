var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required:true, maxLength: 50},
    last_name: {type:String, required:true, maxLength: 50},
    username: {type:String, required:true, maxLength: 20},
    password:{type:String, required:true, maxLength: 25},
    membership_status:{type:String, required:true},
})

module.exports = mongoose.model('User', UserSchema);

/* 

mongoose schema User = {
    first_name: String
    last_name: String
    username: String
    password: String
    membership_status: boolean
    messages: Schema.message (with the user's id)
}

virtual schema = name

virtual schema = account label (username + password)

*/