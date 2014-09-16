var Coupon = require('./models').models.coupon;
var Location = require('./models').models.location;
var User = require('./models').models.user;
var Factual = require('factual-api');
var factual = new Factual('r87lYmE5RDLMQOOcETtoZqnLYEvurbTBfUIUAt8y', '6HZGifE7NYj85JvcKnAqQQ0UKn7gYgFzn7oroQGH');
User.remove({}, function(){console.log('removed')})
Coupon.remove({}, function(){console.log('removed')})
Location.remove({}, function(){console.log('removed')})

module.exports = {
  logIn: function(req,res){
    User.findOne({userName:req.params.userName, password: req.params.password}, 'userName coupons', function(err, user){
      if(user){
        res.send(user);
      } else {
        res.send({failedLogin:true})
      }
    })
  },
  seed: function(){
    var austin = new User({
      userName: 'austin',
      password: 'bourdier',
      coupons: []
    })
    var mike = new User({
      userName: 'mike',
      password: 'miller',
      coupons: []
    })
    var jason = new User({
      userName: 'jason',
      password: 'gates',
      coupons: []
    })
    austin.save();
    mike.save();
    jason.save();
    var discounts = ['20%', '10%', '50%', '45%', '$10', '$15', 'Half', 'Buy one get one half'];
    var item = [' any well drink', ' a childrens meal', 'any appetizer', ' any entree', ' any dessert', ' dinner for four', ' any pitcher of beer'];
    var append = [' while supplies last', ' greater than $25', ' every third friday of the month', ' all summer', ' after 6pm on weekdays', ' for adults 21+'];
    for(var couponIndex = 0; couponIndex < 50; couponIndex++){
      var newCoupon = new Coupon({
        id: couponIndex+1,
        description: discounts[Math.floor(Math.random()*discounts.length)] + ' off ' + item[Math.floor(Math.random()*item.length)] + append[Math.floor(Math.random()*append.length)],
        user: [],
        location: []
      })
      newCoupon.save();
    }
  },
  findClosest: function(req,res){
    var coordsString = req.params.coords;
    factual.get('/t/places-us', {limit:25, filters:{category_ids:{"$includes_any":[312,347]}}, sort: "$distance", geo:{"$circle":{"$center":[coordsString.substring(0,coordsString.indexOf('&')), coordsString.substring(coordsString.indexOf('&')+1)],"$meters":20000}}}, function (error, response) {
      res.send(response.data);
    });
  },
  chooseLocation: function(req,res){
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
  },
  findCoupons: function(req, res){
    Coupon.findOneAndUpdate({id:req.params.id}, {location:[req.params.location]}, function(err, coupon){
      Location.find({name: req.params.location} , function(err, place){
        Coupon.find({location:{$size:0}, user:{$size:0}}, function(err, coupons){
          Coupon.findOne({id:req.params.id}, 'description', function(err,coupon){
            Location.findOneAndUpdate({name:req.params.location}, {currentCoupon: coupon.description}, function(err, location){});
            User.findOneAndUpdate({userName: req.params.userName},{$push: {coupons:place[0].currentCoupon}},function(err, user){
             res.send({location: req.params.location, coupons: coupons, user: user});
           });
          })
        })
      })
    })
  }
}

