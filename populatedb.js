
console.log('This script populates a user admin');


// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require('./models/user');
const bcrypt = require("bcryptjs");





var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://erhartica:Edmunds5@cluster0.neybr.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let admins = [];



function adminCreate(username, password, membership_status, cb) {

    bcrypt.hash(membership_status, 10, (err, hashedPassword) => {




    adminDetail = {
      username: username,
      password: password,
      membership_status: hashedPassword,
    }
  
    var admin = new User(adminDetail);
  
    admin.save(function(err) {
      if(err) {
        cb(err, null);
        return
      }
    })
      console.log("New User: " + admin);
      admins.push(admin)
      cb(null, admin);



    });
  }
  


function createAdmin(cb) {
    async.parallel([
      function(callback) {
        adminCreate("admin554", "Edmunds617548", "gold", callback)
  
      },
      function(callback) {
        adminCreate("admin553", "Edmunds617547", "gold", callback)
      },
    ],
    cb);
  }
  



async.series([
    createAdmin,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Admin: '+ admins);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});