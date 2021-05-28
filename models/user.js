var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type:String, required:true, maxLength: 500},
    password:{type:String, required:true, maxLength: 500},
    membership_status:{type:String, required:true},
})

/*
UserSchema.virtual('name').get(function() {
    return first_name + last_name;
});*/

module.exports = mongoose.model('User', UserSchema);


/* 
 first_name: {type: String, required:true, maxLength: 50},
    last_name: {type:String, required:true, maxLength: 50},
*/

