var express = require('express');
var app     = express();
var bodyParser = require('body-parser')
var server  = require('http').createServer(app);

var mongoose = require('mongoose');
var db = mongoose.connection;
var callback = require('./public/callbacks')

app.use('/', express.static(__dirname + '/'));

mongoose.connect("mongodb://localhost:27017/db", function(err, db) {
  if(!err) {
    console.log("We are connected");
  } else {
    console.log(err)
  }
});
db.on('open', callback.seed)

app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

app.get('/locations/:coords', callback.findClosest);
app.get('/login/:userName/:password', callback.logIn);
app.get('/profile/:name', callback.chooseLocation);
app.get('/:location/coupon/:userName/:id', callback.findCoupons);

server.listen(process.env.PORT || 5000)


