var express = require('express');
var router = express.Router();
var userDao =  require('../dao/userDao');
var postDao = require('../dao/postDao');
var crypto = require('crypto');


/* GET home page. */
router.get('/', function(req, res) {
  	console.log('session.user: '+ req.session.user);
  	try{
  		postDao.PostsForIndex(12,function(err, posts){
	  		if(err){
	  			console.log(err);
	  		}
	  		res.render('index', { title: 'Express',error:'',success:'',layout:true ,user: req.session.user ,login : '',
	 	 		reg : '',index:'index',logout:'',posts: posts});
  		});
  	}catch(e){
  		console.log(e);
  		res.render('index', { title: 'Express',error:'',success:'',layout:true ,user: '',login : '',
 	 		reg : '',index:'index',logout:'',posts: posts});
  	}
	
});

router.get('/hello/:user',function(req, res){
  	res.send('index', 'hello '+ req.params.user+', The time is: ' + new Date());
});

router.get('/u/:user',function(req, res){
	userDao.get(req.params.user, function(err, user){
		if(!user || user.length <= 0){
			err = 'user not exists';
			return res.redirect("/");
		}
		postDao.get(user.name, function(err, posts){
			if(err){
				return res.redirect("/");
			}
		return res.render('user', { title: 'test...',error:err,success:'',layout:true ,user: req.session.user ,login : '',
 	 		reg : '',index:'',logout:'', posts : posts});
		});

	});
});

router.post('/post',function(req, res){
	var cu = req.session.user;
	var Post = postDao.Post;
	var post = new Post({
			user: cu.name, 
			post:req.body.post,
			post_time: new Date()
		});
	 post.save(function(err){
	 	if(err){
	 		return res.redirect('/');
	 	}
	 	res.redirect('/u/'+cu.name);
	 });
});

router.get('/reg', function  (req, res) {
	// console.log('session.user: '+ req.session.user);
	 var u =  req.session.user || '';
 	 res.render('reg', {title : 'user register' ,layout : true,user: u, success:'', error:'',login : '',
 	 	reg : 'reg',index:'',logout:''});
});

router.post('/reg',function(req, res){
	 var u =  req.session.user || '';
	 var err = '';
	
	// encode the pwd
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var User = userDao.User;
	var userName = req.body['user-name'];
	var newUser = new  User({
		name : userName,
		age : 20,
		DOB :  new Date(),
		sex : false,
		pwd : password
	});	

	if(!userName){
		err =  'username is null';
		return res.render('reg', {error: err, success: '',user : '',login : '',
 	 	reg : 'reg',index:'',logout:''});
	}

	if(!req.body['password-repeat'] || !req.body['password']){
		err = 'password counld not be null';
		return res.render('reg', {error: err, success: '', user : req.session.user,login : '',
 	 	reg : 'reg',index:'',logout:''});
	}

	//check pwd
	if(req.body['password-repeat'] != req.body['password']){
		err = 'the pwd you write no the same';
		return res.render('reg', {error: err, success: '', user : req.session.user,login : '',
 	 	reg : 'reg',index:'',logout:''});
	}

	// is user exists
	userDao.get(userName, function  (err, tuser) {
		if(tuser ){
			err = 'username already exists';
			return res.render('reg', {error: err, success: '',user : '',login:'',reg:'reg',index:'',logout:''});
		}

		if(err){
			req.session.error = err;
			return res.render('reg', {error: err, success: '',user:'',login:'',reg:'reg',index:'',logout:''});
		}

		// if not exists user , then create
		newUser.save(function  (err) {
			if(err){
				req.session.error = err;
				return res.render('reg', {error: err, success: '', user : '',login:'',reg:'reg',index:'',logout:''});
			}

			req.session.user = newUser;
			return res.render('reg', {error: '', success: 'reg success',user:newUser,login:'',reg:'reg',index:'',logout:''});
		});

	});

});

router.get('/login', function  (req, res) {
	 var u =  req.session.user || '';
 	 res.render('login', {
 	 	title : 'user register' ,
 	 	layout : true,
 	 	user: u, 
 	 	success:'',
 	 	login : 'login',
 	 	reg : '',
 	 	error:'',
 	 	index:'',logout:''
 	 });
});

router.post('/login', function  (req,res) {
	var err = '';
	if(!req.body.password || !req.body.username){
		err = ' username or password is null';
		return res.render('login', {error: err, success: '',user: req.session.user,login:'login',reg:'',index:'',logout:''});
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	userDao.get(req.body.username, function(err, user){
		if(!user){
			err = 'the user you enter is not exists';
			return res.render('login', {error: err, success: '',user: req.session.user,login:'login',reg:'',index:'',logout:''});
		}
		if( user ){
			user = user._doc;
			if(user.pwd != password){
				err = 'error password';
				return res.render('login', {error: err, success: '',user: req.session.user,login:'login',reg:'',index:'',logout:''});
			}
			req.session.user =  user;
			return res.redirect('/u/'+user.name);
		}
		err = 'user no exists';
		res.render('login', { title: 'Express',error:err,success:'',layout:true ,user: req.session.user ,login : 'login',
 	 		reg : '',index:'',logout:''});
		
	});
});

router.get('/logout', function  (req,res) {
	req.session.user = null;
	return res.redirect("/");
});



router.get('/userlist', function  (req, res) {
	userDao.allUsers(function(err, userlist){
		if(err){
			return next(err);
		}
		console.log(userlist);
		res.render('user', { userlist : userlist});
	});
   
});

function checkLogin(req, res, next){
	var err = '';
	if(!req.session.user){
		err = 'user no exists';
		res.render('login', { title: 'Express',error:err,success:'',layout:true ,user: req.session.user ,login : 'login',
 	 		reg : '',index:'',logout:''});
	}
	next();
}

function checkNotLogin(req, res, next){
	if(req.session.user){
		res.render('index', { title: 'Express',layout:true ,error:'',success:'you have login',user: req.session.user ,login : '',
 	 	reg : '',index:'index',logout:''});
	}
}

module.exports = router;
