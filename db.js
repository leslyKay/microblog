

var util = require('util');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var dburl = require('./config').db;
mongoose.connect(dburl);
var dbConnect = mongoose.connection;

dbConnect.on('error', function callback () {
    console.log('connection error');
}); 

dbConnect.once('open',function callback () {
    console.log('Mongo working...');
});

exports.dbConnect = dbConnect;
exports.mongoose = mongoose;
exports.Schema = Schema;