var app = angular.module('payItForward', []).run(function($rootScope){

})
app.controller('mainCtrl', function($scope, $http) {
  $scope.locations = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, failure)
  } else {
    alert('error')
  }
  function success(position){
    $http({
      url: '/locations/' + position.coords.latitude + '&' + position.coords.longitude,
      type: 'GET',
      dataType: 'json'
    }).success(function(data) {
      data.forEach(function(location){$scope.locations.push(location)})
    })
  }
  function failure(){console.log('failed')}
});

app.controller('profileCtrl', function($scope, $http){
  $scope.currentProfile = [];
  $scope.coupons = [];
  $(document).on('click', '.profile .name', function(){
    $http({
      url: '/profile/' + (this).innerHTML,
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
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
      console.log(data)
    })
  })
  $(document).on('click', '.coupon', function(){
    $http({
      url: $('#currentLocation').text() + '/coupon/' + (this).innerHTML.substring(0, (this).innerHTML.indexOf(' ')),
      type: 'GET',
      dataType: 'json'
    }).success(function(data){
      $scope.coupons = [];
      console.log(data)
      if(data.receivedCoupon.length>0){alert('You have received: ' + data.receivedCoupon)}else{alert('You are the first to leave a coupon at this location, thanks!')}
      data.coupons.forEach(function(coupon){$scope.coupons.push(coupon)});
    })
  })
})
