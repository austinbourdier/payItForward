var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: String,
  currentCoupon: Array
})
var locationSchema = new Schema({
  name: String,
  address: String,
  hours: String,
  phone: String,
  website: String,
  currentCoupon: Array
})
var couponSchema = new Schema({
  description: String,
  user: Array,
  location: Array
})

var Coupon = mongoose.model('coupons', couponSchema);
var User = mongoose.model('User', userSchema);
var Location = mongoose.model('Location', locationSchema);
module.exports = {
  models:{
    coupon: Coupon,
    user: User,
    location: Location
  }
}
