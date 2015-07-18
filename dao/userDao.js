
var dbConnect = require("../db");

//define user model
var userSchema = dbConnect.Schema({
	name : String,
	age : Number,
	DOB : Date,
	sex : Boolean,
	pwd : String
});

//get user model
var User = dbConnect.mongoose.model('tusers', userSchema);
exports.User = User;

var lesly = new User({
	name : 'lesly',
	age : 26,
	DOB : '01/01/1915',
	sex : true,
	pwd : '111111'
});


exports.get = function(userName,callback){
	User.findOne({name:userName},callback);
}

exports.allUsers = function(callback){
	User.find(callback);
}

 