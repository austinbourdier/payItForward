var app = angular.module('payItForward', []).run(function($rootScope){
  $rootScope.myCoupons = [];
  $rootScope.currentUserSignedIn = null;
})
.controller('mainCtrl', function($rootScope, $scope, $http) {
  var userName = prompt('Enter Username');
  var password = prompt('Enter Password');
  $http({
    url: '/login/' + userName + '/' + password,
    type: 'GET',
    dataType: 'json'
  }).success(function(data){
    if(data.failedLogin){
      alert('incorrect credentials');
    } else {
      $rootScope.currentUserSignedIn = data.userName;
      Geolocator.locate();
    }
  })
  var Geolocator = Geolocator || {};
  Geolocator = {
    locate: function(){
      if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(this.success, this.failure)} else {alert('error finding location')}
    },
  success: function(position){
    $http({
      url: '/locations/' + position.coords.latitude + '&' + position.coords.longitude,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      $scope.locations = [];
      data.forEach(function(location){$scope.locations.push({address: location.address, name: location.name, distance: (location.$distance/1000).toFixed(2)})})
    })
  },
  failure: function(){alert('error finding location')}
}

})
.controller('profileCtrl', function($rootScope, $scope, $http){
  $scope.currentProfile = [];
  $(document).on('click', '.profileDiv', function(){
    $http({
      url: '/profile/' + $(this).children()[0].innerText,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      $scope.currentProfile = {
        name: data.location.name,
        address: data.location.address,
        hours: data.location.hours,
        phone: data.location.phone,
        website: data.location.website,
        currentCoupon: data.location.currentCoupon
      }
      $scope.coupons = [];
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
    })
  })
  $(document).on('click', '.coupon', function(){
    $http({
      url: $('#currentLocation').text() + '/coupon/' + $rootScope.currentUserSignedIn + '/' + (this).innerText.substring(0, (this).innerText.indexOf(' ')),
      type: 'GET',
      dataType: 'json'
    }).success(function(data){
      $scope.coupons = [];
      $rootScope.myCoupons = [data.user.coupons];
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
    })
  })
})
.controller('myCouponsCtrl', function($rootScope,$scope, $http){
  $scope.coupons = $rootScope.myCoupons;
})
