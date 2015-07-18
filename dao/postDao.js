
var dbConnect = require("../db");

var postSchema = dbConnect.Schema({
	user : String,
	post : String,
	post_time : Date
});

var Post = dbConnect.mongoose.model('posts', postSchema);
exports.Post = Post;

exports.get = function(userName,callback){
	Post.find({user:userName},callback);
}

exports.allPosts = function(callback){
	Post.find();
}

exports.PostsForIndex = function(limitNum, callback){
	Post.find().where().sort({post_time:-1}).limit(limitNum).exec(callback);
}





