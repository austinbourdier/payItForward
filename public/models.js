var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var allSchemas = allSchemas || {};
allSchemas = {
  userSchema: new Schema({
    userName: String,
    password: String,
    coupons: Array
  }),
  locationSchema: new Schema({
    name: String,
    address: String,
    hours: String,
    phone: String,
    website: String,
    currentCoupon: String
  }),
  couponSchema: new Schema({
    id: Number,
    description: String,
    user: Array,
    location: Array
  })
}
var models = {
  coupon: mongoose.model('Coupons', allSchemas.couponSchema),
  user: mongoose.model('Users', allSchemas.userSchema),
  location: mongoose.model('Locations', allSchemas.locationSchema)
}

module.exports = {
  models:{
    coupon: models.coupon,
    user: models.user,
    location: models.location
  }
}
