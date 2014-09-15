var express = require('express');
var app     = express();
var bodyParser = require('body-parser')
var server  = require('http').createServer(app);
var _ = require('underscore-node');
var Factual = require('factual-api');
var factual = new Factual('r87lYmE5RDLMQOOcETtoZqnLYEvurbTBfUIUAt8y', '6HZGifE7NYj85JvcKnAqQQ0UKn7gYgFzn7oroQGH');
var mongoose = require('mongoose');
var db = mongoose.connection;
var User = require('./models/models').models.user;
var Coupon = require('./models/models').models.coupon;
var Location = require('./models/models').models.location;
app.use('/', express.static(__dirname + '/'));

mongoose.connect("mongodb://localhost:27017/db", function(err, db) {
  if(!err) {
    console.log("We are connected");
  } else {
    console.log(err)
  }
});
db.on('open', function(){
  Coupon.remove({}, function(){console.log('deleted')});
  Location.remove({}, function(){console.log('deleted')});
  User.remove({}, function(){console.log('deleted')});
  var discounts = ['20%', '10%', '50%', '45%', '$10', '$15', 'Half', 'Buy one get one half'];
  var item = [' any well drink', ' a childrens meal', 'any appetizer', ' any entree', ' any dessert', ' dinner for four', ' any pitcher of beer'];
  var append = [' while supplies last', ' greater than $25', ' every third friday of the month', ' all summer', ' after 6pm on weekdays', ' for adults 21+'];
  for(var couponIndex = 0; couponIndex < 50; couponIndex++){
    var newCoupon = new Coupon({
      id: couponIndex+1,
      description: discounts[Math.floor(Math.random()*discounts.length)] + ' off' + item[Math.floor(Math.random()*item.length)] + append[Math.floor(Math.random()*append.length)],
      user: [],
      location: []
    })
    newCoupon.save();
  }
})

app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

app.get('/locations/:coords', function(req,res) {
  var coordsString = req.params.coords;
  factual.get('/t/places-us', {limit:25, filters:{category_ids:{"$includes_any":[312,347]}}, sort: "$distance", geo:{"$circle":{"$center":[coordsString.substring(0,coordsString.indexOf('&')), coordsString.substring(coordsString.indexOf('&')+1)],"$meters":20000}}}, function (error, response) {
    res.send(response.data);
  });
});

app.get('/profile/:name', function(req,res){
  Location.findOne({'name': req.params.name}, 'name address hours_display tel website', function(err, location){
    if (err) return handleError(err);
    if(!location) {
      factual.get('/t/places-us', {limit:1, q: req.params.name, filters:{category_ids:{"$includes_any":[312,347]}}}, function(error, response){
        var newLocation = new Location({
          name: req.params.name,
          address: response.data[0].address,
          hours: response.data[0].hours_display,
          phone: response.data[0].tel,
          website: response.data[0].website,
          currentCoupon: []
        })
        newLocation.save();
        Coupon.find({location:{$size:0}, user:{$size:0}}, function(err, coupons){
          res.send({location: newLocation, coupons: coupons});
        })
      })
    } else {
      Coupon.find({location:{$size:0}}, function(err, coupons){
        res.send({location: location, coupons: coupons});
      })
    }
  });
})

app.get('/:location/coupon/:id', function(req, res){
  Coupon.findOneAndUpdate({id:req.params.id}, {location:[req.params.location]}, function(err, coupon){
    Location.find({name: req.params.location} , function(err, place){
      Coupon.find({location:{$size:0}, user:{$size:0}}, function(err, coupons){
        console.log(place)
         res.send({location: req.params.location, coupons: coupons, receivedCoupon: place[0].currentCoupon});
      })
    })
    Coupon.findOne({id:req.params.id}, 'description', function(err,coupon){
      Location.findOneAndUpdate({name:req.params.location}, {currentCoupon: coupon.description}, function(err, location){})
    })
  })
})

server.listen(process.env.PORT || 5000)


