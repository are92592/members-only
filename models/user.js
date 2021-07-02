var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type:String, required:true, maxLength: 500},
    password:{type:String, required:true, maxLength: 500},
    membership_status:{type:String, required:true},
})


module.exports = mongoose.model('User', UserSchema);


