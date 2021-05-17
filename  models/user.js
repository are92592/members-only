var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required:true, maxLength: 50},
    last_name: {type:String, required:true, maxLength: 50},
    username: {type:String, required:true, maxLength: 20},
    password:{type:String, required:true, maxLength: 25},
    membership_status:{type:String, required:true},
})

UserSchema.virtual('name').get(function() {
    return first_name + last_name;
});


module.exports = mongoose.model('User', UserSchema);

